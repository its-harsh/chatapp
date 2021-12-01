from django.contrib.auth import get_user_model
from django.db import models

User = get_user_model()


class Group(models.Model):
    name = models.CharField(verbose_name='Name', max_length=150)
    description = models.TextField(verbose_name='Description', max_length=500)

    # group_participant_manager = self.groupparticipant_set
    # message_manager = self.message_set

    class Meta:
        verbose_name = 'Group'
        verbose_name_plural = 'Groups'

    def __str__(self):
        return self.name


class GroupParticipant(models.Model):
    group = models.ForeignKey(verbose_name='Group',
                              to=Group, on_delete=models.CASCADE)
    user = models.ForeignKey(
        verbose_name='User', to=User, on_delete=models.CASCADE)
    role = models.CharField(verbose_name='Role', max_length=1, default='n',
                            choices=(('a', 'Admin'), ('n', 'Normal')))

    # role_text = self.get_role_display()

    class Meta:
        verbose_name = 'Group Participant'
        verbose_name_plural = 'Group Participants'
        unique_together = ('group', 'user')

    def __str__(self):
        return f'{self.user} @ {self.group}'


class Message(models.Model):
    group = models.ForeignKey(verbose_name='Group',
                              to=Group, on_delete=models.CASCADE)
    sender = models.ForeignKey(
        verbose_name='Sender', to=User, on_delete=models.CASCADE)
    content = models.TextField(verbose_name='Content', max_length=5000)
    timestamp = models.DateTimeField(
        verbose_name='Timestamp', auto_now_add=True)

    class Meta:
        verbose_name = 'Message'
        verbose_name_plural = 'Messages'
        ordering = ('timestamp',)

    def __str__(self):
        return f'{self.sender} @ {self.group}'


def user_groups_list(user_obj):
    # group_participant_manager = user_obj.groupparticpant_set
    return [
        participant.group for participant in
        user_obj.groupparticipant_set.all()
    ]
