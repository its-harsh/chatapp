from rest_framework import permissions

from chat.models import GroupParticipant


class IsGroupAdminOrReadOnly(permissions.BasePermission):
    pass
