from datetime import timedelta

from django.conf import settings
from django.contrib.auth import get_user_model, update_session_auth_hash
from django.core.mail import send_mail
from django.utils import timezone
from django.utils.crypto import get_random_string
from rest_framework import generics, serializers, status
from rest_framework.generics import CreateAPIView
from rest_framework.parsers import FormParser, JSONParser, MultiPartParser
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView

from .cookie_settings import (
    ACCESS_TOKEN_COOKIE_NAME,
    ACCESS_TOKEN_LIFETIME,
    COOKIE_SETTINGS,
    REFRESH_TOKEN_COOKIE_NAME,
    REFRESH_TOKEN_LIFETIME,
)
from .models import CustomUser
from .serializers import (
    CustomTokenObtainPairSerializer,
    GoogleLoginSerializer,
    UserDetailSerializer,
    UserRegisterSerializer,
)


class UserDetailView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser, JSONParser]
    serializer_class = UserDetailSerializer

    def get_object(self):
        return self.request.user

    def perform_destroy(self, instance):
        if not self.request.data.get("confirm_delete", False):
            raise serializers.ValidationError(
                {"detail": "Debe confirmar la eliminación de la cuenta."}
            )
        instance.delete()


class RegisterView(CreateAPIView):
    permission_classes = [AllowAny]
    serializer_class = UserRegisterSerializer


class CustomTokenObtainPairView(TokenObtainPairView):
    permission_classes = [AllowAny]
    serializer_class = CustomTokenObtainPairSerializer

    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        access = response.data.get("access")
        refresh = response.data.get("refresh")

        # Añadir los tokens como cookies
        if access:
            response.set_cookie(
                key=ACCESS_TOKEN_COOKIE_NAME,
                value=access,
                max_age=ACCESS_TOKEN_LIFETIME,
                **COOKIE_SETTINGS,
            )
        if refresh:
            response.set_cookie(
                key=REFRESH_TOKEN_COOKIE_NAME,
                value=refresh,
                max_age=REFRESH_TOKEN_LIFETIME,
                **COOKIE_SETTINGS,
            )
        return response


class CookieTokenRefreshView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        refresh_token = request.COOKIES.get("refresh_token")
        if not refresh_token:
            return Response(
                {"detail": "No refresh token"}, status=status.HTTP_401_UNAUTHORIZED
            )
        try:
            refresh = RefreshToken(refresh_token)
            access = str(refresh.access_token)
            response = Response({"access": access, "detail": "Token refreshed"})
            response.set_cookie(
                key=ACCESS_TOKEN_COOKIE_NAME,
                value=access,
                max_age=ACCESS_TOKEN_LIFETIME,
                **COOKIE_SETTINGS,
            )
            return response
        except Exception:
            return Response(
                {"detail": "Invalid refresh token"}, status=status.HTTP_401_UNAUTHORIZED
            )


class GoogleLoginView(CreateAPIView):
    permission_classes = [AllowAny]
    serializer_class = GoogleLoginSerializer

    def create(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        tokens = serializer.save()

        response = Response(tokens, status=status.HTTP_200_OK)
        access = tokens.get("access")
        refresh = tokens.get("refresh")

        if access:
            response.set_cookie(
                key=ACCESS_TOKEN_COOKIE_NAME,
                value=access,
                max_age=ACCESS_TOKEN_LIFETIME,
                **COOKIE_SETTINGS,
            )
        if refresh:
            response.set_cookie(
                key=REFRESH_TOKEN_COOKIE_NAME,
                value=refresh,
                max_age=REFRESH_TOKEN_LIFETIME,
                **COOKIE_SETTINGS,
            )
        return response


class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):

        response = Response(
            {"detail": "Sesión cerrada exitosamente."},
            status=status.HTTP_205_RESET_CONTENT,
        )
        response.delete_cookie(ACCESS_TOKEN_COOKIE_NAME)
        response.delete_cookie(REFRESH_TOKEN_COOKIE_NAME)
        # Blacklist refresh token si lo envías en el body
        refresh_token = request.data.get("refresh") or request.COOKIES.get(
            "refresh_token"
        )
        if refresh_token:
            try:
                token = RefreshToken(refresh_token)
                token.blacklist()
            except Exception:
                pass
        return response


class ChangePasswordView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        current_password = request.data.get("current_password")
        new_password = request.data.get("new_password")

        if not current_password:
            return Response(
                {"error": "La contraseña actual es obligatoria"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        if not new_password:
            return Response(
                {"error": "La nueva contraseña es obligatoria"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if not user.check_password(current_password):
            return Response(
                {"error": "La contraseña actual es incorrecta"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        user.set_password(new_password)
        user.save()
        update_session_auth_hash(request, user)
        return Response(
            {"message": "Contraseña cambiada exitosamente"}, status=status.HTTP_200_OK
        )


class PasswordResetRequestView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get("email")
        User = get_user_model()
        user = User.objects.filter(email=email).first()

        if user:
            # Generar un token único
            token = get_random_string(length=32)

            # Guardar el token y la fecha de creación en el usuario
            user.password_reset_token = token
            user.token_created_at = timezone.now()
            user.save()

            # Enviar el correo electrónico con el enlace de restablecimiento
            reset_link = f"{settings.FRONTEND_URL}/login/reset-password?token={token}"
            send_mail(
                "Restablecer contraseña",
                f"Usa este enlace para restablecer tu contraseña: {reset_link}",
                settings.EMAIL_HOST_USER,
                [user.email],
                fail_silently=False,
            )

            return Response(
                {
                    "message": f"Se ha enviado un enlace a {email} para restablecer la contraseña"
                },
                status=status.HTTP_200_OK,
            )

        return Response(
            {"error": f"El correo {email} no está registrado"},
            status=status.HTTP_400_BAD_REQUEST,
        )


class PasswordResetConfirmView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        token = request.data.get("token")
        new_password = request.data.get("new_password")

        if not token:
            return Response(
                {"error": "El token es obligatorio"}, status=status.HTTP_400_BAD_REQUEST
            )

        # Buscar al usuario con el token
        user = CustomUser.objects.filter(password_reset_token=token).first()

        if user:
            # Verificar si el token ha expirado
            if user.token_created_at and (
                timezone.now() - user.token_created_at
            ) > timedelta(hours=24):
                return Response(
                    {"error": "El token ha expirado"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            # Restablecer la contraseña
            user.set_password(new_password)
            user.password_reset_token = None  # Invalidar el token
            user.token_created_at = None
            user.save()

            return Response(
                {"message": "Contraseña restablecida exitosamente"},
                status=status.HTTP_200_OK,
            )

        return Response(
            {"error": "Token inválido o expirado"}, status=status.HTTP_400_BAD_REQUEST
        )
