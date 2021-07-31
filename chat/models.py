import uuid

from django.contrib.auth import get_user_model
from django.db import models

User = get_user_model()


class ChatRoom(models.Model):
    uuid = models.UUIDField(verbose_name='Room ID', default=uuid.uuid4, unique=True, primary_key=True)
    room_name = models.CharField(verbose_name='Chat Room Name', max_length=30)
    members = models.ManyToManyField(verbose_name='Chat Room Members', to=User)

    def __str__(self):
        return self.room_name


class Message(models.Model):
    chatroom = models.ForeignKey(verbose_name='Chat Room', to=ChatRoom, on_delete=models.CASCADE)
    author = models.ForeignKey(verbose_name='Author', to=User, on_delete=models.CASCADE)
    content = models.TextField(verbose_name='Message Content', max_length=4000)
    timestamp = models.DateTimeField(verbose_name='Timestamp', auto_now_add=True)

    def __str__(self):
        return f'Message by {self.author} in {self.chatroom}'