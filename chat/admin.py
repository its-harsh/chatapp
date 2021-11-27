from django.contrib import admin
from .models import Group, GroupParticipant, Message

admin.site.register(Group)
admin.site.register(GroupParticipant)
admin.site.register(Message)
