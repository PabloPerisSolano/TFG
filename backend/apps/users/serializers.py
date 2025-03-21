from .models import CustomUser
from rest_framework import serializers
from django.contrib.auth import authenticate
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer


class UserRegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'password',
                  'email', 'first_name', 'last_name']
        read_only_fields = ['id']
        extra_kwargs = {
            'password': {'write_only': True},
            'first_name': {'required': False},
            'last_name': {'required': False},
        }

    def create(self, validated_data):
        return CustomUser.objects.create_user(**validated_data)


class UserDetailSerializer(serializers.ModelSerializer):
    profile_picture_url = serializers.SerializerMethodField()

    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'email', 'first_name',
                  'last_name', 'profile_picture', 'profile_picture_url']
        read_only_fields = ['id']

    def get_profile_picture_url(self, obj):
        request = self.context.get('request')
        if obj.profile_picture and request:
            return request.build_absolute_uri(obj.profile_picture.url)
        return None

    def validate(self, attrs):
        user = self.instance

        if 'username' in attrs and CustomUser.objects.filter(username=attrs['username']).exclude(pk=user.pk).exists():
            raise serializers.ValidationError(
                {"username": "Este nombre de usuario ya está en uso."})

        if 'email' in attrs and CustomUser.objects.filter(email=attrs['email']).exclude(pk=user.pk).exists():
            raise serializers.ValidationError(
                {"email": "Este correo electrónico ya está en uso."})

        profile_picture = attrs.get('profile_picture')
        if profile_picture and not profile_picture.name.lower().endswith(('.png', '.jpg', '.jpeg', '.gif')):
            raise serializers.ValidationError(
                {"profile_picture":
                    "Solo se permiten archivos de imagen (PNG, JPG, JPEG, GIF)."}
            )

        return attrs


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        username_or_email = attrs.get("username")
        password = attrs.get("password")

        if username_or_email and password:
            # Intentar autenticar con email
            user = authenticate(request=self.context.get(
                "request"), email=username_or_email, password=password)
            if not user:
                # Si no funciona con email, intentar con username
                user = authenticate(request=self.context.get(
                    "request"), username=username_or_email, password=password)
            if not user:
                raise serializers.ValidationError("Credenciales inválidas.")
        else:
            raise serializers.ValidationError(
                "Se requieren ambos campos: username/email y password.")

        # Generar el token utilizando el usuario autenticado
        data = super().validate(
            {"username": user.username, "password": password})
        return data
