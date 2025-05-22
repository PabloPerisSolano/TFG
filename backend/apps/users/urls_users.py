from django.urls import path

from .views import ChangePasswordView, UserDetailView

urlpatterns = [
    path("me/", UserDetailView.as_view(), name="user_detail"),
    path("me/change-password/", ChangePasswordView.as_view(), name="change-password"),
]
