from decimal import Clamped
from rest_framework import generics, response
from rest_framework.authtoken.models import Token
from rest_framework.authtoken.views import ObtainAuthToken as BaseObtainAuthTokenView
from .serializers import UserSerializer

class RegisterUserView(generics.CreateAPIView):
    serializer_class = UserSerializer

class ObtainAuthTokenView(BaseObtainAuthTokenView):
    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        token, created = Token.objects.get_or_create(user=user)
        return response.Response({'token': token.key, 'username': token.user.username})