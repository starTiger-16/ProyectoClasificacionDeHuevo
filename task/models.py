from django.db import models
from django.contrib.auth.models import AbstractUser
from django.contrib.auth.models import BaseUserManager
from django.conf import settings
from decimal import Decimal
# Create your models here.
class CustomUserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):     
        if not email:
            raise ValueError("Email requerido")
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        return self.create_user(email, password, **extra_fields)

# models.py
class CustomUser(AbstractUser):
    email = models.EmailField(max_length=200, unique=True)
    username = models.CharField(max_length=200, null=True, blank=True)
    nombre = models.CharField(max_length=200, null=True, blank=True)
    direccion = models.CharField(max_length=300, null=True, blank=True)
    telefono = models.CharField(max_length=100, null=True, blank=True)
    
    ROL_CHOICES = (
        ('admin', 'Administrador'),
        ('propietario', 'Propietario'),
        ('cliente', 'Cliente'),
    )
    rol = models.CharField(max_length=20, choices=ROL_CHOICES, default='cliente')

    objects = CustomUserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

class Huevo(models.Model):
    radio = models.FloatField()
    peso = models.FloatField()
    categoria = models.CharField(max_length=20)
    fecha = models.DateTimeField(auto_now_add=True)
    granja = models.ForeignKey('Granja', on_delete=models.CASCADE, null=True, blank=True)
    vendido = models.BooleanField(default=False)  # ✅ Nuevo campo

    def __str__(self):
        return f"{self.categoria} - {'Vendido' if self.vendido else 'Stock'}"

class EstadoMaquina(models.Model):
    encendida = models.BooleanField(default=False)
    online = models.BooleanField(default=False)
    ultima_actualizacion = models.DateTimeField(auto_now=True)
    
class Task(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    done = models.BooleanField(default=False)

    def __str__(self):
        return self.title
    
class Pedido(models.Model):
    usuario = models.CharField(max_length=100)
    producto = models.CharField(max_length=100)
    unidades = models.PositiveIntegerField(default=1)
    costo_unitario = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    costo_total = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    fecha = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        if self.unidades is not None and self.costo_unitario is not None:
            self.costo_total = Decimal(self.unidades) * self.costo_unitario
        else:
            self.costo_total = Decimal(0)
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.usuario} pidió {self.unidades}x {self.producto}"
    
class Granja(models.Model):
    nombre = models.CharField(max_length=100)
    ubicacion = models.CharField(max_length=200)
    telefono = models.CharField(max_length=50)
    descripcion = models.TextField()
    propietario = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)

    def __str__(self):
        return self.nombre

class PrecioMaple(models.Model):
    tipo = models.CharField(max_length=5, unique=True)  # S, M, L, XL
    precio = models.FloatField()

    def __str__(self):
        return f"{self.tipo}: Bs. {self.precio}"






