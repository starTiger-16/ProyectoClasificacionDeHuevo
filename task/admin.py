from django.contrib import admin
from .models import *
# Register your models here.
admin.site.register(CustomUser)
admin.site.register(Huevo)
admin.site.register(Pedido)
admin.site.register(EstadoMaquina)
admin.site.register(Granja)