from django.contrib.auth.models import AbstractUser
from django.db import models


class CustomUser(AbstractUser):
    email = models.EmailField(unique=True)
    profile_picture = models.ImageField(
        upload_to='profile_pictures/', blank=True, null=True)
    password_reset_token = models.CharField(
        max_length=32, blank=True, null=True)
    token_created_at = models.DateTimeField(blank=True, null=True)

    def __str__(self):
        return self.username
