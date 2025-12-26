from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    ProductViewSet, 
    CartViewSet, 
    NewsletterViewSet, 
    UserMeView, 
    PaymentView,
    CartItemViewSet
)

router = DefaultRouter()
router.register(r'products', ProductViewSet, basename='product')
router.register(r'cart', CartViewSet, basename='cart')
router.register(r'newsletter', NewsletterViewSet, basename='newsletter')

# Matches frontend api/payment/
router.register(r'payment', PaymentView, basename='payment')

# Matches frontend api/cart_items/
router.register(r'cart_items', CartItemViewSet, basename='cart-item')

urlpatterns = [
    path('', include(router.urls)),
    
    # Custom dashboard endpoint
    path('me/', UserMeView.as_view({'get': 'list'}), name='user-me'),
]