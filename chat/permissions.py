from rest_framework import permissions
from .models import GroupParticipant


class ParticipantObjectPermission(permissions.BasePermission):

    def has_permission(self, request, view):
        return request.user.is_authenticated

    def has_object_permission(self, request, view, obj):
        try:
            participant = GroupParticipant.objects.get(
                group=obj.group, user=request.user)
        except GroupParticipant.DoesNotExist:
            return False

        if participant.role == 'a':
            return True
        elif obj.user == request.user and request.method == 'DELETE':
            return True
        return False
