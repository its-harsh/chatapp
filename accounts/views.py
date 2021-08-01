from django.contrib.auth import get_user_model
from .serializers import UserSerializer
from rest_framework import generics

User = get_user_model()


class RegisterUserView(generics.CreateAPIView):
    serializer_class = UserSerializer