from rest_framework import serializers
from .models import Group, GroupParticipant, Message


class GroupSerializer(serializers.ModelSerializer):

    class Meta:
        model = Group
        fields = ('id', 'name')

    def get_field_names(self, declared_fields, info):
        field_names = super().get_field_names(declared_fields, info)
        extra_field_names = self.context.get('extra_fields')

        if extra_field_names:
            return field_names + extra_field_names
        return field_names

    def create(self, validated_data):
        group = super().create(validated_data)
        GroupParticipant.objects.create(
            group=group, user=self.context['request'].user, role='a')
        return group


class GroupParticpantSerializer(serializers.ModelSerializer):

    class Meta:
        model = GroupParticipant
        fields = ('user', 'role')
        read_only_fields = ('user', )

    def to_representation(self, instance):
        context = super().to_representation(instance)
        context['user'] = instance.user.email
        context['name'] = instance.user.username
        return context
