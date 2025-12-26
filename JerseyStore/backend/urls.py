from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    # 1. Django Admin Panel
    path('admin/', admin.site.urls),
    
    # 2. Your App's API Endpoints (This is where your jerseys live!)
    path('api/', include('store.urls')),
    
    # 3. Djoser Authentication (Standard Login/Register)
    path('auth/', include('djoser.urls')),
    path('auth/', include('djoser.urls.jwt')),

    # Note: Allauth and Social Auth paths have been removed 
    # to match your updated settings.py
]

# 4. Media Serving (For Jersey Images)
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)