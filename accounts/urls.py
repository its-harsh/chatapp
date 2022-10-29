from django.urls import path
from accounts.views import ObtainAuthTokenView, RegisterUserView

urlpatterns = [
    path('login/', ObtainAuthTokenView.as_view()),
    path('register/', RegisterUserView.as_view()), 
]
