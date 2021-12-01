from django.http.response import Http404
from rest_framework import generics, permissions, response, status
from rest_framework.views import APIView
from .models import Group, GroupParticipant, user_groups_list
from .serializers import GroupParticpantSerializer, GroupSerializer
from .permissions import ParticipantObjectPermission


class GroupCreateView(generics.CreateAPIView):
    serializer_class = GroupSerializer
    permission_classes = [permissions.IsAuthenticated, ]

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['extra_fields'] = ('description', )
        return context


class GroupListView(generics.ListAPIView):
    serializer_class = GroupSerializer
    permission_classes = [permissions.IsAuthenticated, ]

    def get_queryset(self):
        return user_groups_list(self.request.user)


class GroupView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = GroupSerializer
    permission_classes = [permissions.IsAuthenticated, ]
    lookup_field = 'id'

    def get_object(self):
        for group in user_groups_list(self.request.user):
            if group.id == self.kwargs['id']:
                return group
        raise Http404

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['extra_fields'] = ('description', )
        return context


class ParticipantListView(generics.ListAPIView):
    serializer_class = GroupParticpantSerializer
    permission_class = [permissions.IsAuthenticated, ]

    def get_queryset(self):
        return Group.objects.get(
            id=self.kwargs['id']
        ).groupparticipant_set.all()


class GroupInviteView(APIView):
    permission_classes = [permissions.IsAuthenticated, ]
    # implement token instead of id

    def post(self, *args, **kwargs):
        participant, created = GroupParticipant.objects.get_or_create(
            user=self.request.user,
            group=Group.objects.get(id=kwargs['id'])
        )

        status_code = status.HTTP_200_OK
        if created:
            status_code = status.HTTP_201_CREATED

        return response.Response(
            data={
                'group': participant.group.name,
                'user': participant.user.username,
            },
            status=status_code
        )


class ParticipantView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = GroupParticpantSerializer
    permission_classes = [ParticipantObjectPermission, ]
    lookup_field = 'id'

    def get_object(self):
        user_id = self.request.query_params.get('user_id')
        if not user_id:
            user_id = self.request.user.id
        try:
            return GroupParticipant.objects.get(
                group__id=self.kwargs['id'],
                user__id=user_id
            )
        except GroupParticipant.DoesNotExist:
            raise Http404

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
