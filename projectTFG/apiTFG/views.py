from rest_framework import viewsets
from apiTFG.models import Usuario
from apiTFG.serializer import UsuarioSerializer

# Create your views here.


class UsuarioViewSet(viewsets.ModelViewSet):
    queryset = Usuario.objects.all()
    serializer_class = UsuarioSerializer
