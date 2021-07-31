from rest_framework import generics, permissions, response
from django.http import Http404
from .models import ChatRoom, Message
from .serializers import ChatRoomSerializer, MessageSerializer


class ChatRoomList(generics.ListAPIView):
    queryset = ChatRoom.objects.all()
    serializer_class = ChatRoomSerializer
    permission_classes = []


class LastMessage(generics.RetrieveAPIView):
    serializer_class = MessageSerializer
    permission_classes = []

    def retrieve(self, request, *args, **kwargs):
        try:
            last_message = Message.objects.filter(chatroom__uuid=self.kwargs['chatroom']).latest('timestamp')
        except Message.DoesNotExist:
            raise Http404
        serializer = self.get_serializer(last_message)
        return response.Response(serializer.data)