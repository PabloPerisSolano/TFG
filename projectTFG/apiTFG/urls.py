from rest_framework.routers import DefaultRouter
from apiTFG.views import UsuarioViewSet

router = DefaultRouter()
router.register('usuarios', UsuarioViewSet, basename='usuario')
urlpatterns = router.urls
