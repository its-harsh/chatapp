import json
from channels.generic.websocket import WebsocketConsumer
from asgiref.sync import async_to_sync
from .models import ChatRoom, Message
from .serializers import MessageSerializer


class ChatRoomConsumer(WebsocketConsumer):
    def __init__(self, *args, **kwargs):
        super().__init__(args, kwargs)

    def connect(self):
        self.user = self.scope['user']
        if not self.user.is_authenticated:
            self.close()
        else:
            self.chatroom_id = self.scope['url_route']['kwargs']['chatroom_id']
            self.chatroom_name = f'group_{self.chatroom_id}'
            async_to_sync(self.channel_layer.group_add)(
                self.chatroom_name, self.channel_name
            )
            self.accept()

    def get_data(self, signal, payload):
        if (signal == 'load_messages'):
            return MessageSerializer(
                        Message.objects
                            .filter(chatroom__uuid=self.chatroom_id)
                            .order_by('timestamp'), many=True
                    ).data
        elif (signal == 'new_message'):
            message = Message.objects.create(
                chatroom=ChatRoom.objects.get(uuid=self.chatroom_id),
                content=payload['content'], author=self.user
            )
            return MessageSerializer(message).data

    def receive(self, text_data):
        payload = json.loads(text_data);
        signal = payload['signal']
        data = self.get_data(signal, payload)
        async_to_sync(self.channel_layer.group_send)(
            self.chatroom_name,
            {
                'type': signal,
                'payload': data
            }
        )

    def load_messages(self, event):
        self.send(
            text_data=json.dumps({
                'signal': event['type'],
                'messages': event['payload']
            })
        )

    def new_message(self, event):
        self.send(
            text_data=json.dumps({
                'signal': event['type'],
                'message': event['payload']
            })
        )