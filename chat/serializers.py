from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import ChatRoom, Message

User = get_user_model()


class MessageAuthorSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('username',)


class ChatRoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChatRoom
        fields = ('uuid', 'room_name')


class MessageSerializer(serializers.ModelSerializer):
    author = MessageAuthorSerializer()
    class Meta:
        model = Message
        fields = ('author', 'content', 'timestamp')
