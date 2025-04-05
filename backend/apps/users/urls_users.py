from .views import UserDetailView, ChangePasswordView
from django.urls import path

urlpatterns = [
    path('me/', UserDetailView.as_view(), name='user_detail'),
    path('me/change-password/', ChangePasswordView.as_view(), name='change-password'),
]
