from django.urls import path
from .views import GroupListView, GroupView, GroupCreateView, ParticipantListView

urlpatterns = [
    path('api/list-group/', GroupListView.as_view(), name='list-group-api'),
    path('api/group/', GroupCreateView.as_view(), name='group-create-api'),
    path('api/group/<int:id>/', GroupView.as_view(), name='group-info-api'),
    path('api/group/<int:id>/participants/',
         ParticipantListView.as_view(), name='list-participant-api'),
]
