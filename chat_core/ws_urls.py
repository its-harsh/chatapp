from django.urls import path, include

urlpattern = [
    path('chat/', include('chat.ws_urls')),
]