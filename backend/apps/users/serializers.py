from django.conf import settings
from django.contrib.auth import authenticate
from django.utils.text import slugify
from google.auth.transport import requests
from google.oauth2 import id_token
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.tokens import RefreshToken

from .models import CustomUser


class UserDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = [
            "id",
            "username",
            "email",
            "first_name",
            "last_name",
            "profile_picture",
        ]
        read_only_fields = ["id"]

    def get_profile_picture(self, obj):
        if obj.profile_picture:
            request = self.context.get("request")
            return (
                request.build_absolute_uri(obj.profile_picture.url) if request else None
            )
        return None

    def validate(self, attrs):
        user = self.instance

        if (
            "username" in attrs
            and CustomUser.objects.filter(username=attrs["username"])
            .exclude(pk=user.pk)
            .exists()
        ):
            raise serializers.ValidationError(
                {"username": "Este nombre de usuario ya está en uso."}
            )

        if (
            "email" in attrs
            and CustomUser.objects.filter(email=attrs["email"])
            .exclude(pk=user.pk)
            .exists()
        ):
            raise serializers.ValidationError(
                {"email": "Este correo electrónico ya está en uso."}
            )

        profile_picture = attrs.get("profile_picture")
        if profile_picture and not profile_picture.name.lower().endswith(
            (".png", ".jpg", ".jpeg", ".gif")
        ):
            raise serializers.ValidationError(
                {
                    "profile_picture": "Solo se permiten archivos de imagen (PNG, JPG, JPEG, GIF)."
                }
            )

        return attrs


class UserRegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ["id", "username", "password", "email", "first_name", "last_name"]
        read_only_fields = ["id"]
        extra_kwargs = {
            "password": {"write_only": True},
            "first_name": {"required": False},
            "last_name": {"required": False},
        }

    def create(self, validated_data):
        return CustomUser.objects.create_user(**validated_data)


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        username_or_email = attrs.get("username")
        password = attrs.get("password")

        if username_or_email and password:
            # Intentar autenticar con email
            user = authenticate(
                request=self.context.get("request"),
                email=username_or_email,
                password=password,
            )
            if not user:
                # Si no funciona con email, intentar con username
                user = authenticate(
                    request=self.context.get("request"),
                    username=username_or_email,
                    password=password,
                )
            if not user:
                raise serializers.ValidationError("Credenciales inválidas.")
        else:
            raise serializers.ValidationError(
                "Se requieren ambos campos: username/email y password."
            )

        # Generar el token utilizando el usuario autenticado
        data = super().validate({"username": user.username, "password": password})
        data["user"] = UserDetailSerializer(user, context=self.context).data
        return data


class GoogleLoginSerializer(serializers.Serializer):
    token = serializers.CharField(required=True)

    def _verify_google_token(self, token):
        return id_token.verify_oauth2_token(
            token,
            requests.Request(),
            settings.GOOGLE_CLIENT_OAUTH2,
        )

    def _generate_unique_username(self, email):
        base_username = slugify(email.split("@")[0])
        username = base_username
        counter = 1

        while CustomUser.objects.filter(username=username).exists():
            username = f"{base_username}{counter}"
            counter += 1

        return username

    def _sync_user_from_google(self, idinfo):
        email = idinfo.get("email")

        # Caso 1: Usuario existente con este email
        existing_user = CustomUser.objects.filter(email=email).first()
        if existing_user:
            return existing_user

        # Caso 2: Si no existe se crea el nuevo usuario
        username = self._generate_unique_username(email)
        return CustomUser.objects.create(
            email=email,
            username=username,
            first_name=idinfo.get("given_name", ""),
            last_name=idinfo.get("family_name", ""),
        )

    def validate(self, attrs):
        try:
            idinfo = self._verify_google_token(attrs["token"])
            user = self._sync_user_from_google(idinfo)
            attrs["user"] = user
            return attrs
        except ValueError as e:
            raise serializers.ValidationError(f"Token inválido: {e}")

    def create(self, validated_data):
        user = validated_data["user"]
        refresh = RefreshToken.for_user(user)
        return {
            "access": str(refresh.access_token),
            "refresh": str(refresh),
            "user": UserDetailSerializer(user, context=self.context).data,
        }
