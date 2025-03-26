from .serializers import UserRegisterSerializer, UserDetailSerializer, CustomTokenObtainPairSerializer, GoogleLoginSerializer
from .models import CustomUser
from rest_framework import status, generics, serializers
from rest_framework.views import APIView
from rest_framework.generics import CreateAPIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import update_session_auth_hash, get_user_model
from django.utils import timezone
from django.utils.crypto import get_random_string
from django.conf import settings
from django.core.mail import send_mail
from datetime import timedelta


class RegisterView(CreateAPIView):
    permission_classes = [AllowAny]
    serializer_class = UserRegisterSerializer


class UserDetailView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser, JSONParser]
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

        if not token:
            return Response({'error': 'El token es obligatorio'}, status=status.HTTP_400_BAD_REQUEST)

        # Buscar al usuario con el token
        user = CustomUser.objects.filter(password_reset_token=token).first()

        if user:
            # Verificar si el token ha expirado
            if user.token_created_at and (timezone.now() - user.token_created_at) > timedelta(hours=24):
                return Response({'error': 'El token ha expirado'}, status=status.HTTP_400_BAD_REQUEST)

            # Restablecer la contraseña
            user.set_password(new_password)
            user.password_reset_token = None  # Invalidar el token
            user.token_created_at = None
            user.save()

            return Response({'message': 'Contraseña restablecida exitosamente'}, status=status.HTTP_200_OK)

        return Response({'error': 'Token inválido o expirado'}, status=status.HTTP_400_BAD_REQUEST)


class CustomTokenObtainPairView(TokenObtainPairView):
    permission_classes = [AllowAny]
    serializer_class = CustomTokenObtainPairSerializer


class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            # Obtener el token de actualización del cuerpo de la solicitud
            refresh_token = request.data.get("refresh")
            token = RefreshToken(refresh_token)
            # Agregar el token a la lista negra
            token.blacklist()
            return Response({"detail": "Sesión cerrada exitosamente."}, status=status.HTTP_205_RESET_CONTENT)
        except Exception as e:
            return Response({"detail": "Token inválido o ya está en la lista negra."}, status=status.HTTP_400_BAD_REQUEST)


class GoogleLoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = GoogleLoginSerializer(
            data=request.data,
            # Para generar URLs absolutas en UserDetailSerializer
            context={'request': request}
        )
        if serializer.is_valid():
            return Response(serializer.validated_data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
