from django.urls import path
from .views import GroupListView, GroupView, GroupCreateView, ParticipantListView, GroupInviteView, ParticipantView

urlpatterns = [
    path('api/list-group/', GroupListView.as_view(), name='list-group-api'),
    path('api/group/', GroupCreateView.as_view(), name='group-create-api'),
    path('api/group/<int:id>/', GroupView.as_view(), name='group-info-api'),
    path('api/group/<int:id>/invite/',
         GroupInviteView.as_view(), name='group-invite-api'),
    path('api/group/<int:id>/list-participant/',
         ParticipantListView.as_view(), name='list-participant-api'),
    path('api/group/<int:id>/participant/', ParticipantView.as_view(),
         name='remove-participant-api'),
]
