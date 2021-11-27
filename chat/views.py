# from rest_framework import generics, response, permissions
# from rest_framework_simplejwt.authentication import JWTAuthentication
# from django.http import Http404
# from .models import ChatRoom, Message
# from .serializers import ChatRoomSerializer, MessageSerializer


# class ChatRoomList(generics.ListAPIView):
#     serializer_class = ChatRoomSerializer
#     permission_classes = [permissions.IsAuthenticated, ]
#     authentication_classes = [JWTAuthentication, ]

#     def get_queryset(self):
#         return ChatRoom.objects.filter(members__in=[self.request.user.id]).distinct()


# class LastMessage(generics.RetrieveAPIView):
#     serializer_class = MessageSerializer
#     permission_classes = [permissions.IsAuthenticated, ]
#     authentication_classes = [JWTAuthentication, ]

#     def retrieve(self, request, *args, **kwargs):
#         try:
#             last_message = Message.objects.filter(
#                 chatroom__uuid=self.kwargs['chatroom'],
#                 chatroom__members__in=[self.request.user]
#             ).distinct().latest('timestamp')
#         except Message.DoesNotExist:
#             raise Http404
#         serializer = self.get_serializer(last_message)
#         return response.Response(serializer.data)
