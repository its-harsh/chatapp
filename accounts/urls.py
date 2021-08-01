from django.urls import path
from rest_framework_simplejwt.views import token_obtain_pair, token_refresh
from .views import RegisterUserView

urlpatterns = [
    path('login/', token_obtain_pair),
    path('login/refresh/', token_refresh),
    path('register/', RegisterUserView.as_view())
]
