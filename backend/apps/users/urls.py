from .views import RegisterView, UserDetailView, ChangePasswordView, PasswordResetRequestView, PasswordResetConfirmView
from django.urls import path
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    path('me/', UserDetailView.as_view(), name='user_detail'),
    path('me/change-password/', ChangePasswordView.as_view(), name='change-password'),

    path('password-reset-request/', PasswordResetRequestView.as_view(),
         name='password_reset_request'),
    path('password-reset-confirm/', PasswordResetConfirmView.as_view(),
         name='password_reset_confirm'),
]
