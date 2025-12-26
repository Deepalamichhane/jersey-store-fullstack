from django.db import models
from django.contrib.auth.models import AbstractUser
from django.db.models.signals import post_save
from django.dispatch import receiver

# ===================================================================
# 1. USER & PROFILE MODELS
# ===================================================================

class User(AbstractUser):
    """
    Custom User model for Jersey Arena.
    Uses related_name to avoid clashes with Django's default auth app.
    """
    is_customer = models.BooleanField(default=True)
    phone_number = models.CharField(max_length=15, blank=True)
    
    groups = models.ManyToManyField(
        'auth.Group', 
        related_name='store_user_set', 
        blank=True
    )
    user_permissions = models.ManyToManyField(
        'auth.Permission', 
        related_name='store_user_permissions_set', 
        blank=True
    )

class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    points = models.PositiveIntegerField(default=0)
    tier = models.CharField(max_length=10, default='Bronze')
    
    # Shipping info for the "Roster" dashboard
    shipping_address = models.TextField(blank=True, default='')
    city = models.CharField(max_length=100, blank=True, default='')
    zip_code = models.CharField(max_length=20, blank=True, default='')

    def update_tier(self):
        if self.points >= 2000: self.tier = 'Gold'
        elif self.points >= 500: self.tier = 'Silver'
        else: self.tier = 'Bronze'
        self.save()

    def __str__(self):
        return f"Profile for {self.user.username}"

# ===================================================================
# 2. PRODUCT & CATEGORY MODELS
# ===================================================================

class Category(models.Model):
    name = models.CharField(max_length=100)
    slug = models.SlugField(unique=True)

    class Meta:
        verbose_name_plural = "Categories"

    def __str__(self): 
        return self.name

class Product(models.Model):
    category = models.ForeignKey(Category, related_name='products', on_delete=models.CASCADE)
    name = models.CharField(max_length=200)
    team = models.CharField(max_length=100)
    season = models.CharField(max_length=20)
    jersey_type = models.CharField(max_length=20, default='HOME') # HOME, AWAY, THIRD, SPECIAL
    description = models.TextField()
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self): 
        return f"{self.team} {self.name} ({self.season})"

class ProductSKU(models.Model):
    """Handles different sizes (S, M, L, XL) for a specific jersey."""
    product = models.ForeignKey(Product, related_name='skus', on_delete=models.CASCADE)
    sku_code = models.CharField(max_length=50, unique=True, null=True, blank=True)
    size = models.CharField(max_length=10) 
    price = models.DecimalField(max_digits=10, decimal_places=2)
    custom_printing_cost = models.DecimalField(max_digits=5, decimal_places=2, default=15.00)
    stock_quantity = models.PositiveIntegerField(default=0)
    image = models.ImageField(upload_to='products/', blank=True, null=True)

    def __str__(self): 
        return f"{self.product.team} - {self.size}"

# ===================================================================
# 3. SHOPPING CART & ORDER MODELS
# ===================================================================

class Cart(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='carts')
    created_at = models.DateTimeField(auto_now_add=True)
    
    def get_total_price(self):
        return sum(item.get_total_item_price() for item in self.items.all())

class CartItem(models.Model):
    cart = models.ForeignKey(Cart, related_name='items', on_delete=models.CASCADE)
    sku = models.ForeignKey(ProductSKU, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)
    # Customization data
    custom_name = models.CharField(max_length=50, blank=True, null=True)
    custom_number = models.IntegerField(blank=True, null=True)

    def get_total_item_price(self):
        base_price = self.sku.price * self.quantity
        # Add printing cost only if customization exists
        if self.custom_name or self.custom_number:
            return base_price + (self.sku.custom_printing_cost * self.quantity)
        return base_price

class Order(models.Model):
    STATUS_CHOICES = (
        ('PENDING', 'Pending'), 
        ('PAID', 'Paid'), 
        ('SHIPPED', 'Shipped'),
        ('CANCELLED', 'Cancelled')
    )
    user = models.ForeignKey(User, on_delete=models.PROTECT)
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='PENDING')
    
    # FIXED: Added default values to prevent migration errors
    shipping_address = models.TextField(blank=True, default='')
    city = models.CharField(max_length=100, blank=True, default='')
    zip_code = models.CharField(max_length=20, blank=True, default='')
    
    transaction_id = models.CharField(max_length=255, unique=True, null=True, blank=True)
    voucher_used = models.CharField(max_length=20, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Order {self.id} by {self.user.username}"

class OrderItem(models.Model):
    order = models.ForeignKey(Order, related_name='items', on_delete=models.CASCADE)
    sku = models.ForeignKey(ProductSKU, on_delete=models.SET_NULL, null=True)
    
    # UPDATE THIS LINE:
    product_name = models.CharField(max_length=255, blank=True, default='') 
    
    price_at_purchase = models.DecimalField(max_digits=10, decimal_places=2)
    quantity = models.PositiveIntegerField()
    custom_name = models.CharField(max_length=50, blank=True, null=True)
    custom_number = models.IntegerField(blank=True, null=True)

    def __str__(self):
        return f"{self.product_name} x {self.quantity}"

        
class Newsletter(models.Model):
    email = models.EmailField(unique=True)
    subscribed_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.email

# ===================================================================
# 4. SIGNALS (Auto-creation of Profile)
# ===================================================================

@receiver(post_save, sender=User)
def create_profile(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(user=instance)

@receiver(post_save, sender=User)
def save_profile(sender, instance, **kwargs):
    instance.profile.save()