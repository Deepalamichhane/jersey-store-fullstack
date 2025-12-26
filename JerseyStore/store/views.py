import stripe
import time
import hmac
import hashlib
import base64
import json
from decimal import Decimal
from django.conf import settings
from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action

# Import models
from .models import (
    Cart, Order, OrderItem, ProductSKU, 
    Product, Newsletter, User, CartItem
)

# Import serializers
from .serializers import (
    ProductSerializer, NewsletterSerializer, 
    CartSerializer, UserSerializer
)

stripe.api_key = settings.STRIPE_SECRET_KEY

# --- PRODUCT & NEWSLETTER ---

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.filter(is_active=True)
    serializer_class = ProductSerializer
    permission_classes = [permissions.AllowAny]

class NewsletterViewSet(viewsets.ModelViewSet):
    queryset = Newsletter.objects.all()
    serializer_class = NewsletterSerializer
    permission_classes = [permissions.AllowAny]

# --- USER & CART ---

class UserMeView(viewsets.ViewSet):
    permission_classes = [permissions.IsAuthenticated]
    
    def list(self, request):
        serializer = UserSerializer(request.user, context={'request': request})
        return Response(serializer.data)

class CartViewSet(viewsets.ModelViewSet):
    serializer_class = CartSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Cart.objects.filter(user=self.request.user)

    def list(self, request):
        cart, _ = Cart.objects.get_or_create(user=request.user)
        serializer = self.get_serializer(cart)
        return Response(serializer.data)

    @action(detail=False, methods=['get'], url_path='my_cart')
    def my_cart(self, request):
        cart, _ = Cart.objects.get_or_create(user=request.user)
        serializer = self.get_serializer(cart)
        return Response(serializer.data)

    @action(detail=True, methods=['patch'], url_path='update_shipping')
    def update_shipping(self, request, pk=None):
        cart = self.get_object()
        shipping_method = request.data.get('shipping_method')
        if shipping_method:
            # Logic for updating shipping if field exists
            cart.save()
        return Response({"status": "shipping updated", "cart_id": cart.id}, status=status.HTTP_200_OK)

    @action(detail=False, methods=['post'], url_path='add_item')
    def add_item(self, request):
        cart, _ = Cart.objects.get_or_create(user=request.user)
        sku_id = request.data.get('sku_id')
        quantity = int(request.data.get('quantity', 1))
        custom_name = str(request.data.get('custom_name', '')).strip().upper()
        custom_number = str(request.data.get('custom_number', '')).strip()

        try:
            item, created = CartItem.objects.get_or_create(
                cart=cart, 
                sku_id=sku_id,
                custom_name=custom_name,
                custom_number=custom_number,
                defaults={'quantity': quantity}
            )
            if not created:
                item.quantity += quantity
                item.save()
            return Response({"message": "Item added to locker"}, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

class CartItemViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return CartItem.objects.filter(cart__user=self.request.user)

# --- PAYMENT ---

class PaymentView(viewsets.ViewSet):
    permission_classes = [permissions.IsAuthenticated]

    @action(detail=True, methods=['get'], url_path='check-status')
    def check_cart_status(self, request, pk=None):
        try:
            cart = Cart.objects.filter(id=pk, user=request.user).first()
            if not cart or not cart.items.exists():
                return Response({"status": "completed", "is_converted": True})
            return Response({"status": "active", "is_converted": False})
        except Exception:
            return Response({"status": "unknown"}, status=status.HTTP_404_NOT_FOUND)

    @action(detail=False, methods=['post'], url_path='create-checkout-session')
    def create_checkout_session(self, request):
        """
        Creates a Stripe Checkout Session for either 'Instant Buy' or 'Full Cart'.
        """
        try:
            is_instant = request.data.get('is_instant', False)
            shipping_cost = Decimal('10.00')
            
            if is_instant:
                sku_id = request.data.get('sku_id')
                if not sku_id:
                    return Response({"error": "sku_id is required for instant purchase"}, status=400)
                
                sku = ProductSKU.objects.get(id=sku_id)
                qty = int(request.data.get('qty', 1))
                total_cents = int((Decimal(str(sku.price)) * qty + shipping_cost) * 100)
                
                metadata = {
                    "sku_id": str(sku.id), 
                    "qty": str(qty), 
                    "is_instant": "true",
                    "user_id": str(request.user.id)
                }
                line_item_name = f"Instant Purchase: {sku.product.name}"
            else:
                cart, _ = Cart.objects.get_or_create(user=request.user)
                if not cart.items.exists():
                    return Response({"error": "Locker is empty"}, status=400)
                
                total_val = Decimal(str(cart.get_total_price() or 0))
                total_cents = int((total_val + shipping_cost) * 100)
                metadata = {
                    "is_instant": "false", 
                    "cart_id": str(cart.id),
                    "user_id": str(request.user.id)
                }
                line_item_name = "Jersey Arena - Locker Checkout"

            session = stripe.checkout.Session.create(
                payment_method_types=['card'],
                line_items=[{
                    'price_data': {
                        'currency': 'usd', 
                        'product_data': {'name': line_item_name}, 
                        'unit_amount': total_cents
                    }, 
                    'quantity': 1
                }],
                mode='payment',
                metadata=metadata,
                success_url=f"{settings.CLIENT_URL}/success?session_id={{CHECKOUT_SESSION_ID}}",
                cancel_url=f"{settings.CLIENT_URL}/cart",
            )
            return Response({'url': session.url})
            
        except ProductSKU.DoesNotExist:
            return Response({"error": "Product SKU not found"}, status=404)
        except Exception as e:
            print(f"STRIPE ERROR: {str(e)}")
            return Response({"error": "Failed to create payment session"}, status=400)

    @action(detail=False, methods=['post'], url_path='process-esewa')
    def process_esewa(self, request):
        """
        Generates the signed data required for eSewa's v2 API.
        """
        try:
            cart, _ = Cart.objects.get_or_create(user=request.user)
            if not cart.items.exists():
                return Response({"error": "Locker is empty"}, status=400)

            cart_total = cart.get_total_price() or Decimal('0.00')
            shipping_cost = Decimal('10.00')
            total_amount = Decimal(str(cart_total)) + shipping_cost
            
            product_code = getattr(settings, 'ESEWA_PRODUCT_CODE', 'EPAYTEST')
            secret_key = getattr(settings, 'ESEWA_SECRET_KEY', '8g8M8ksRXz9S7S4U')
            transaction_uuid = f"CART-{cart.id}-{int(time.time())}"
            
            # Message format: total_amount,transaction_uuid,product_code
            data_to_sign = f"total_amount={total_amount},transaction_uuid={transaction_uuid},product_code={product_code}"
            
            secret_bytes = secret_key.encode('utf-8')
            data_bytes = data_to_sign.encode('utf-8')
            hash_result = hmac.new(secret_bytes, data_bytes, hashlib.sha256).digest()
            signature = base64.b64encode(hash_result).decode('utf-8')

            return Response({
                "amount": str(total_amount),
                "tax_amount": "0",
                "total_amount": str(total_amount),
                "transaction_uuid": transaction_uuid,
                "product_code": product_code,
                "product_service_charge": "0",
                "product_delivery_charge": "0",
                "success_url": f"{settings.CLIENT_URL}/success",
                "failure_url": f"{settings.CLIENT_URL}/cart",
                "signed_field_names": "total_amount,transaction_uuid,product_code",
                "signature": signature,
                "esewa_url": "https://rc-epay.esewa.com.np/api/epay/main/v2/form"
            })
        except Exception as e:
            print(f"ESEWA ERROR: {str(e)}")
            return Response({"error": "Internal server error during eSewa processing"}, status=400)

    @action(detail=False, methods=['post'], url_path='verify-payment')
    def verify_payment(self, request):
        """
        Verifies Stripe session and converts cart to Order.
        """
        try:
            session_id = request.data.get('session_id')
            if not session_id:
                return Response({"error": "session_id required"}, status=400)

            session = stripe.checkout.Session.retrieve(session_id)
            if session.payment_status == 'paid':
                # Idempotency check: Don't create order twice
                if Order.objects.filter(stripe_payment_id=session.id).exists():
                    return Response({"message": "Order already processed"}, status=200)

                order = Order.objects.create(
                    user=request.user,
                    total_price=Decimal(session.amount_total) / 100,
                    status='paid',
                    stripe_payment_id=session.id
                )

                is_instant = session.metadata.get('is_instant') == 'true'

                if is_instant:
                    sku = ProductSKU.objects.get(id=session.metadata.get('sku_id'))
                    OrderItem.objects.create(
                        order=order, 
                        sku=sku, 
                        quantity=int(session.metadata.get('qty', 1)), 
                        price=sku.price
                    )
                else:
                    cart_id = session.metadata.get('cart_id')
                    cart = Cart.objects.get(id=cart_id, user=request.user)
                    for item in cart.items.all():
                        OrderItem.objects.create(
                            order=order, sku=item.sku, quantity=item.quantity, 
                            price=item.sku.price, custom_name=item.custom_name, 
                            custom_number=item.custom_number
                        )
                    cart.items.all().delete()
                
                return Response({"order_id": order.id, "status": "success"}, status=status.HTTP_200_OK)
            return Response({"error": "Payment failed"}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            print(f"VERIFICATION ERROR: {str(e)}")
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)