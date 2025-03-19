from .serializers import UserRegisterSerializer, UserDetailSerializer
from .models import CustomUser
from django.utils.crypto import get_random_string
from django.conf import settings
from django.core.mail import send_mail
from rest_framework import status, generics, serializers
from rest_framework.views import APIView
from rest_framework.generics import CreateAPIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser
from django.contrib.auth import update_session_auth_hash
from django.contrib.auth.models import User
from django.utils import timezone
from datetime import timedelta


class RegisterView(CreateAPIView):
    permission_classes = [AllowAny]
    serializer_class = UserRegisterSerializer


class UserDetailView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]
    serializer_class = UserDetailSerializer

    def get_object(self):
        return self.request.user

    def perform_destroy(self, instance):
        if not self.request.data.get('confirm_delete', False):
            raise serializers.ValidationError(
                {"detail": "Debe confirmar la eliminación de la cuenta."})
        instance.delete()


class ChangePasswordView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        current_password = request.data.get('current_password')
        new_password = request.data.get('new_password')

        if not current_password:
            return Response({'error': 'La contraseña actual es obligatoria'}, status=status.HTTP_400_BAD_REQUEST)
        if not new_password:
            return Response({'error': 'La nueva contraseña es obligatoria'}, status=status.HTTP_400_BAD_REQUEST)

        if not user.check_password(current_password):
            return Response({'error': 'La contraseña actual es incorrecta'}, status=status.HTTP_400_BAD_REQUEST)

        user.set_password(new_password)
        user.save()
        update_session_auth_hash(request, user)
        return Response({'message': 'Contraseña cambiada exitosamente'}, status=status.HTTP_200_OK)


class PasswordResetRequestView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get('email')
        user = User.objects.filter(email=email).first()

        if user:
            # Generar un token único
            token = get_random_string(length=32)

            # Guardar el token en el perfil del usuario
            profile, _ = CustomUser.objects.get_or_create(user=user)
            profile.password_reset_token = token
            profile.token_created_at = timezone.now()
            profile.save()

            # Enviar el correo electrónico con el enlace de restablecimiento
            reset_link = f"{settings.FRONTEND_URL}/reset-password?token={token}"
            send_mail(
                'Restablecer contraseña',
                f'Usa este enlace para restablecer tu contraseña: {reset_link}',
                settings.EMAIL_HOST_USER,
                [user.email],
                fail_silently=False,
            )

            return Response({'message': 'Se ha enviado un enlace para restablecer la contraseña'}, status=status.HTTP_200_OK)

        return Response({'error': 'No se encontró ningún usuario con este correo electrónico'}, status=status.HTTP_400_BAD_REQUEST)


class PasswordResetConfirmView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        token = request.data.get('token')
        new_password = request.data.get('new_password')

        # Buscar el perfil del usuario con el token
        profile = CustomUser.objects.filter(
            password_reset_token=token).first()

        if profile:
            # Verificar si el token ha expirado
            if profile.token_created_at and (timezone.now() - profile.token_created_at) > timedelta(hours=24):
                return Response({'error': 'El token ha expirado'}, status=status.HTTP_400_BAD_REQUEST)

            # Restablecer la contraseña
            user = profile.user
            user.set_password(new_password)
            user.save()

            # Invalidar el token
            profile.password_reset_token = None
            profile.token_created_at = None
            profile.save()

            return Response({'message': 'Contraseña restablecida exitosamente'}, status=status.HTTP_200_OK)

        return Response({'error': 'Token inválido o expirado'}, status=status.HTTP_400_BAD_REQUEST)
