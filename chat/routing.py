from django.urls import path
from .consumers import ChatRoomConsumer


websocket_urlpatterns = [
    path('chat/<uuid:chatroom_id>/', ChatRoomConsumer.as_asgi()),
]