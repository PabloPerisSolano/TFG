class CookieTokenMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        # Extraer el accessToken de las cookies
        access_token = request.COOKIES.get('accessToken')

        # Si existe, colocarlo en la cabecera Authorization
        if access_token:
            request.META['HTTP_AUTHORIZATION'] = f'Bearer {access_token}'

        response = self.get_response(request)
        return response
