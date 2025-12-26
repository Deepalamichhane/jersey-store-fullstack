from rest_framework import serializers
from .models import (
    Product, ProductSKU, Category, Cart, 
    CartItem, User, Order, OrderItem, Profile, Newsletter
)

# --- 1. USER & PROFILE SERIALIZERS ---
class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ['points', 'tier', 'shipping_address', 'city', 'zip_code']

class UserSerializer(serializers.ModelSerializer):
    profile = ProfileSerializer(read_only=True)
    
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'phone_number', 'profile']

# --- 2. PRODUCT & SKU SERIALIZERS ---
class ProductSKUSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductSKU
        fields = ['id', 'sku_code', 'size', 'price', 'custom_printing_cost', 'stock_quantity', 'image']

class ProductSerializer(serializers.ModelSerializer):
    skus = ProductSKUSerializer(many=True, read_only=True)
    category_name = serializers.CharField(source='category.name', read_only=True)
    
    # This creates the 'main_image' field for your React ProductCard
    main_image = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = [
            'id', 'name', 'team', 'season', 'jersey_type', 
            'description', 'category_name', 'skus', 'main_image'
        ]

    def get_main_image(self, obj):
        """
        Grabs the image from the first SKU associated with the product.
        Uses absolute URI so the frontend gets the full URL including the domain.
        """
        # Finds the first SKU that actually has an image file path assigned
        first_sku = obj.skus.exclude(image="").first() 
        
        if first_sku and first_sku.image:
            request = self.context.get('request')
            if request:
                # Returns http://127.0.0.1:8000/media/products/jersey.png
                return request.build_absolute_uri(first_sku.image.url)
            return first_sku.image.url
        return None

# --- 3. CART & ITEM SERIALIZERS ---
class CartItemSerializer(serializers.ModelSerializer):
    sku = ProductSKUSerializer(read_only=True)
    total_item_price = serializers.ReadOnlyField(source='get_total_item_price')

    class Meta:
        model = CartItem
        fields = ['id', 'sku', 'quantity', 'custom_name', 'custom_number', 'total_item_price']

class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(many=True, read_only=True)
    total_price = serializers.ReadOnlyField(source='get_total_price')

    class Meta:
        model = Cart
        fields = ['id', 'items', 'total_price']

# --- 4. ORDER & UTILITY SERIALIZERS ---
class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = '__all__'

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)

    class Meta:
        model = Order
        fields = ['id', 'total_amount', 'status', 'transaction_id', 'created_at', 'items']

class NewsletterSerializer(serializers.ModelSerializer):
    class Meta:
        model = Newsletter
        fields = ['id', 'email', 'subscribed_at']