from django.urls import path
from rest_framework_simplejwt.views import token_obtain_pair, token_refresh

urlpatterns = [
    path('login/', token_obtain_pair),
    path('login/refresh/', token_refresh),
]
