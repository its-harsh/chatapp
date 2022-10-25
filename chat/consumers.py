import json
from channels.generic.websocket import WebsocketConsumer
from asgiref.sync import async_to_sync
from .models import Message
from .serializers import MessageSerializer


class ChatRoomConsumer(WebsocketConsumer):
    def __init__(self, *args, **kwargs):
        super().__init__(args, kwargs)

    def connect(self):
        self.chatroom_id = self.scope['url_route']['kwargs']['chatroom_id']
        self.chatroom_name = f'group_{self.chatroom_id}'
        async_to_sync(self.channel_layer.group_add)(
            self.chatroom_name, self.channel_name
        )
        self.accept()

    def receive(self, text_data):
        data = json.loads(text_data)
        async_to_sync(self.channel_layer.group_send)(
            self.chatroom_name,
            {
                'type': data['action'],
                'event': {}
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
        print("New Message")