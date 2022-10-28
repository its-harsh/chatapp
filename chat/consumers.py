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

    def receive(self, text_data):
        received_payload = json.loads(text_data);
        signal = received_payload['signal']
        received_payload.pop('signal')
        async_to_sync(self.channel_layer.group_send)(
            self.chatroom_name,
            {
                'type': signal,
                'payload': received_payload
            }
        )

    def load_messages(self, event):
        self.send(
            text_data=json.dumps(MessageSerializer(
                Message.objects
                    .filter(chatroom__uuid=self.chatroom_id)
                    .order_by('timestamp'), many=True
            ).data)
        )

    def new_message(self, event):
        payload = event['payload']
        Message.objects.create(
            chatroom=ChatRoom.objects.get(uuid=self.chatroom_id),
            content=payload['content'], author=self.user
        )