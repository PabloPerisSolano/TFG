from django.conf import settings

ACCESS_TOKEN_COOKIE_NAME = "access_token"
REFRESH_TOKEN_COOKIE_NAME = "refresh_token"

ACCESS_TOKEN_LIFETIME = int(
    settings.SIMPLE_JWT["ACCESS_TOKEN_LIFETIME"].total_seconds()
)
REFRESH_TOKEN_LIFETIME = int(
    settings.SIMPLE_JWT["REFRESH_TOKEN_LIFETIME"].total_seconds()
)

SECURE = not settings.DEBUG
SAMESITE = "None" if SECURE else "Lax"

COOKIE_SETTINGS = {
    "httponly": True,
    "secure": SECURE,
    "samesite": SAMESITE,
    "path": "/",
}
