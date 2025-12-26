from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
from .models import Product, Category

class ProductApiTest(TestCase):
    def setUp(self):
        # Create a sample category and product for the test
        self.client = APIClient()
        self.category = Category.objects.create(name="Skin", slug="skin")
        self.product = Product.objects.create(
            category=self.category,
            name="Test Serum",
            slug="test-serum",
            description="A test product"
        )

    def test_get_product_list(self):
        """Test if the products API returns a 200 OK status"""
        # This matches the 'api/products/' path you defined
        url = '/api/products/' 
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)