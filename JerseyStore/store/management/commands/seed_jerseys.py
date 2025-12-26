from django.core.management.base import BaseCommand
from store.models import Category, Product, ProductSKU

class Command(BaseCommand):
    help = 'Seeds and syncs the database with jerseys and image paths'

    def handle(self, *args, **kwargs):
        self.stdout.write('🏟️ Starting Integrated Jersey Seeding & Sync...')
        
        # 1. Setup Categories with proper slugs
        intl, _ = Category.objects.get_or_create(name="International", slug="international")
        club, _ = Category.objects.get_or_create(name="Club Teams", slug="club-teams")
        nfl, _ = Category.objects.get_or_create(name="American Football (NFL)", slug="american-football-nfl")

        # 2. Jersey Data List
        jerseys = [
            {"name": "Argentina 2024 Home (Messi)", "cat": intl, "price": 120.00, "sku": "ARG-10-M", "size": "M", "img": "products/mes.png"},
            {"name": "Portugal 2024 Home (Ronaldo)", "cat": intl, "price": 120.00, "sku": "POR-7-L", "size": "L", "img": "products/arsenal.png"},
            {"name": "Real Madrid 24/25 (Mbappe)", "cat": club, "price": 140.00, "sku": "RMA-9-M", "size": "M", "img": "products/mb.png"},
            {"name": "Man City 24/25 (Haaland)", "cat": club, "price": 110.00, "sku": "MCI-9-L", "size": "L", "img": "products/h.png"},
            {"name": "Inter Miami Home (Messi)", "cat": club, "price": 130.00, "sku": "MIA-10-S", "size": "S", "img": "products/i.png"},
            {"name": "Kansas City Chiefs (Mahomes)", "cat": nfl, "price": 170.00, "sku": "KC-15-L", "size": "L", "img": "products/mahomes.png"},
        ]

        for item in jerseys:
            # Update or Create the Product
            prod, _ = Product.objects.get_or_create(
                name=item['name'], 
                category=item['cat'],
                
            )
            
            # Update or Create the SKU (This forces the image sync)
            ProductSKU.objects.update_or_create(
                product=prod,
                sku_code=item['sku'],
                defaults={
                    'size': item['size'],
                    'price': item['price'], 
                    'stock_quantity': 50,
                    'image': item['img']  # Overwrites existing image path if it changed
                }
            )
            
            
            self.stdout.write(self.style.SUCCESS(f"✅ Synced: {item['name']}"))

        self.stdout.write(self.style.SUCCESS('✨ Database Sync Complete!'))