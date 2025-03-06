from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.models import User
from rest_framework.permissions import AllowAny
from rest_framework.permissions import IsAuthenticated
from .serializers import UserSerializer
from django.contrib.auth import update_session_auth_hash
from rest_framework_simplejwt.views import TokenObtainPairView


class CustomTokenObtainPairView(TokenObtainPairView):
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)

        if response.status_code == status.HTTP_200_OK:
            access_token = response.data['access']
            refresh_token = response.data['refresh']

            response.set_cookie(
                'accessToken',
                access_token,
                httponly=True,
                secure=False,
                samesite='Lax',
                max_age=3600,
            )
            response.set_cookie(
                'refreshToken',
                refresh_token,
                httponly=True,
                secure=False,
                samesite='Lax',
                max_age=7 * 24 * 3600,
            )

            del response.data['access']
            del response.data['refresh']

        return response


class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        response = Response({"message": "Logout successful"},
                            status=status.HTTP_200_OK)
        response.delete_cookie('accessToken')
        response.delete_cookie('refreshToken')
        return response


class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        email = request.data.get('email')

        if not username or not password or not email:
            return Response({'error': 'Todos los campos son obligatorios'}, status=status.HTTP_400_BAD_REQUEST)

        if User.objects.filter(username=username).exists():
            return Response({'error': 'El nombre de usuario ya está en uso'}, status=status.HTTP_400_BAD_REQUEST)

        user = User.objects.create_user(
            username=username, password=password, email=email)
        return Response({'message': 'Usuario registrado exitosamente'}, status=status.HTTP_201_CREATED)


class UserDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)

    def patch(self, request, *args, **kwargs):
        user = request.user
        data = request.data

        if 'first_name' in data:
            user.first_name = data['first_name']
        if 'last_name' in data:
            user.last_name = data['last_name']
        if 'email' in data:
            user.email = data['email']

        user.save()
        serializer = UserSerializer(user)
        return Response(serializer.data)

    def delete(self, request, *args, **kwargs):
        user = request.user
        user.delete()
        return Response({'message': 'Cuenta eliminada exitosamente'}, status=status.HTTP_204_NO_CONTENT)


class ChangePasswordView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        user = request.user
        current_password = request.data.get('current_password')
        new_password = request.data.get('new_password')

        if not current_password or not new_password:
            return Response({'error': 'Todos los campos son obligatorios'}, status=status.HTTP_400_BAD_REQUEST)

        if not user.check_password(current_password):
            return Response({'error': 'La contraseña actual es incorrecta'}, status=status.HTTP_400_BAD_REQUEST)

        user.set_password(new_password)
        user.save()

        update_session_auth_hash(request, user)

        return Response({'message': 'Contraseña cambiada exitosamente'}, status=status.HTTP_200_OK)
