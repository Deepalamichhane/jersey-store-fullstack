from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import (
    User, Profile, Category, Product, ProductSKU, 
    Cart, CartItem, Order, OrderItem, Newsletter
)

# --- 1. USER & PROFILE ---
# This ensures that when you view a User, you see their Profile details below it
class ProfileInline(admin.StackedInline):
    model = Profile
    can_delete = False
    readonly_fields = ('tier',)

@admin.register(User)
class UserAdmin(BaseUserAdmin):
    inlines = (ProfileInline,)
    list_display = ('username', 'email', 'is_staff', 'is_customer')
    fieldsets = BaseUserAdmin.fieldsets + (
        ('Custom Roles', {'fields': ('is_customer', 'phone_number')}),
    )

# --- 2. PRODUCT & SKUs (The "One-Page" Management) ---
class ProductSKUInline(admin.TabularInline):
    model = ProductSKU
    extra = 1  # Provides 1 empty row to quickly add a new size/image
    # Adding 'image' to fields makes it visible in the table row
    fields = ['size', 'price', 'stock_quantity', 'image', 'sku_code']

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('team', 'name', 'season', 'jersey_type', 'is_active', 'category')
    list_filter = ('team', 'category', 'is_active')
    search_fields = ('name', 'team')
    inlines = [ProductSKUInline] # This allows you to add images/sizes inside the Product page

# --- 3. ORDERS & CUSTOMIZATION ---
class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    readonly_fields = ('sku', 'quantity', 'price_at_purchase', 'custom_name', 'custom_number')

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'total_amount', 'status', 'created_at')
    list_filter = ('status', 'created_at')
    search_fields = ('id', 'user__username')
    inlines = [OrderItemInline]

# --- 4. CART & UTILITY ---
class CartItemInline(admin.TabularInline):
    model = CartItem
    extra = 0

@admin.register(Cart)
class CartAdmin(admin.ModelAdmin):
    list_display = ('user', 'created_at')
    inlines = [CartItemInline]

# --- 5. CATEGORY & NEWSLETTER ---
@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug')
    prepopulated_fields = {'slug': ('name',)} # This auto-fills the slug while you type the name

admin.site.register(Newsletter)
