from django.urls import path
from rest_framework.authtoken.views import obtain_auth_token
from accounts.views import RegisterUserView

urlpatterns = [
    path('login/', obtain_auth_token),
    path('register/', RegisterUserView.as_view()), 
]
