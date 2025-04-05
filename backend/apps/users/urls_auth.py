from .views import RegisterView, CustomTokenObtainPairView, GoogleLoginView, LogoutView, PasswordResetRequestView, PasswordResetConfirmView
from django.urls import path
from rest_framework_simplejwt.views import (
    TokenRefreshView,
)

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),

    path('login/', CustomTokenObtainPairView.as_view(), name='login'),
    path('google/', GoogleLoginView.as_view(), name='google'),
    path('logout/', LogoutView.as_view(), name='logout'),

    path('refresh/', TokenRefreshView.as_view(), name='token-refresh'),

    path('password-reset-request/', PasswordResetRequestView.as_view(),
         name='password-reset-request'),
    path('password-reset-confirm/', PasswordResetConfirmView.as_view(),
         name='password-reset-confirm'),
]
