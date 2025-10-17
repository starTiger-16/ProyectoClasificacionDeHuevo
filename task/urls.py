# task/urls.py
from django.urls import path
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from .views import *

urlpatterns = [
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/register/', RegisterUser.as_view(), name='register'),
    path('api/login/', LoginUser.as_view(), name='login'), 
    path("api/pedidos/lista/", ListaPedidosAPIView.as_view(), name="lista-pedidos"),
    path("api/velocidad/<int:granja_id>/", velocidad_clasificacion_granja), 
    path("api/pedidos/", CrearPedidoView.as_view()),
    path("api/pedidos/<int:id>/", EliminarPedidoView.as_view()),
    path('api/estado/', EstadoActualAPIView.as_view(), name='estado_maquina'),
    path('api/usuario-info/', UsuarioInfoView.as_view(), name='usuario-info'),
    path('api/huevos/', ListaHuevosAPIView.as_view()),
    path("api/granjas/registrar/", RegistrarGranjaYPropietario.as_view(), name="registrar_granja_propietario"),
    path("api/set-granja-actual", SetGranjaActualView.as_view()),
    path("api/granjas", ListaGranjasAPIView.as_view()),
    path("api/mis-granjas", MisGranjasAPIView.as_view()),
    path("api/huevos/<int:granja_id>/", conteo_huevos_por_granja),
    path('api/resumen-huevos', ResumenHuevosAPIView.as_view()),
    path("api/stock-maples/", StockMaplesView.as_view()),
    path("api/agregar-maple/", AgregarMapleManualView.as_view()),
    path("api/marcar-vendidos/", MarcarVendidosView.as_view()),
    path("api/precios-maple/", PreciosMapleView.as_view()),
    path("api/reporte-huevos-pdf", ReporteHuevosPDF.as_view(), name="reporte_huevos_pdf"),
]
