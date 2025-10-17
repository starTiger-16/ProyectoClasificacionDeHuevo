from django.http import JsonResponse
from django.utils import timezone
from datetime import timedelta
from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate,login
import paho.mqtt.publish as publish
from .serializers import PedidoSerializer
from rest_framework.generics import ListAPIView
from rest_framework.generics import DestroyAPIView
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from decimal import Decimal
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from rest_framework.views import APIView
from rest_framework.response import Response
import json
import os
from rest_framework.permissions import AllowAny
from django.utils.timezone import now, timedelta

from django.http import HttpResponse
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet
import io
from datetime import datetime

from rest_framework.views import APIView
from rest_framework.response import Response
from django.http import HttpResponse
from datetime import datetime
import io

from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle

from .models import *
class MaquinaControlAPIView(APIView):
    def post(self, request):
        estado = request.data.get("estado")  # debe ser "ON" o "OFF"
        if estado in ["ON", "OFF"]:
            encendida = estado == "ON"
            EstadoMaquina.objects.update_or_create(id=1, defaults={"encendida": encendida})

            # Publicar en MQTT
            publish.single("maquina/control", estado, hostname="localhost")
            return Response({"mensaje": f"Máquina {'encendida' if encendida else 'apagada'}."})
        return Response({"error": "Estado inválido."}, status=400)

class RegisterUser(APIView):
    def post(self, request):
        data = request.data
        print("Datos recibidos en el backend:", data)

        email = data.get("email")
        password = data.get("password")
        username = data.get("username")
        nombre = data.get("nombre")
        direccion = data.get("direccion")
        telefono = data.get("telefono")
        codigo_admin = data.get("codigo_admin")

        if not email or not password:
            return Response({"error": "Campos requeridos"}, status=400)

        if CustomUser.objects.filter(email=email).exists():
            return Response({"error": "Usuario ya existe"}, status=400)

        es_admin = codigo_admin == "ADMIN123"

        try:
            user = CustomUser.objects.create_user(
                email=email,
                password=password,
                username=username,
                nombre=nombre,
                direccion=direccion,
                telefono=telefono,
                is_staff=es_admin,
                is_superuser=es_admin
            )
            return Response({"message": "Usuario creado correctamente"}, status=201)
        except Exception as e:
            print("❌ Error al crear usuario:", str(e))
            return Response({"error": str(e)}, status=400)


class LoginUser(APIView):
    def post(self, request):
        email = request.data.get("email")
        password = request.data.get("password")

        user = authenticate(request, email=email, password=password)

        if user is not None:
            login(request, user)
            request.session.save()
            return Response({
                "message": "Login exitoso",
                "id": user.id,                 # <--- Agrega esto
                "es_admin": user.is_staff,
                "username": user.username,
                "email": user.email,
                "rol": user.rol,
            }, status=status.HTTP_200_OK)
        else:
            return Response({"error": "Credenciales inválidas"}, status=401)


class ListaPedidosAPIView(APIView):
    def get(self, request):
        pedidos = Pedido.objects.all().order_by('-fecha')
        datos = []

        for p in pedidos:
            datos.append({
                "id": p.id,
                "usuario": p.usuario,
                "producto": p.producto,
                "unidades": p.unidades,
                "costo_unitario": p.costo_unitario,
                "costo_total": p.costo_total,
                "fecha": p.fecha.isoformat(),
            })

        return Response(datos)
def velocidad_clasificacion_granja(request, granja_id):
    huevos = Huevo.objects.filter(granja_id=granja_id).order_by('-fecha')[:2]

    if len(huevos) < 2:
        return JsonResponse({'velocidad': 0})  # No hay suficiente data

    delta = (huevos[0].fecha - huevos[1].fecha).total_seconds()

    if delta == 0:
        velocidad = 0
    else:
        velocidad = 60 / delta  # huevos por minuto

    return JsonResponse({'velocidad': round(velocidad, 2)})

class CrearPedidoView(APIView):
    def post(self, request):
        try:
            producto = request.data.get("producto")
            user = request.data.get("usuario")
            unidades = int(request.data.get("unidades", 1))
            costo_unitario = Decimal(str(request.data.get("costo_unitario", 0)))

            Pedido.objects.create(
                usuario=user,
                producto=producto,
                unidades=unidades,
                costo_unitario=costo_unitario,
                # ❌ NO pongas costo_total → el modelo lo calcula automáticamente
            )

            return Response({"status": "✅ Pedido registrado correctamente"}, status=201)

        except Exception as e:
            print("🔥 Error al crear el pedido:", e)
            return Response({"error": str(e)}, status=500)

class EliminarPedidoView(DestroyAPIView):
    queryset = Pedido.objects.all()
    serializer_class = PedidoSerializer
    lookup_field = 'id'

class EstadoActualAPIView(APIView):
    def get(self, request):
        estado = EstadoMaquina.objects.last()
        if estado:
            return Response({
                "encendida": estado.encendida,
                "online": estado.online
            })
        else:
            return Response({
                "encendida": False,
                "online": False
            })
        
class UsuarioInfoView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        return Response({
            "id": user.id,
            "email": user.email,
            "username": user.username,
            "nombre": user.first_name,
            "apellido": user.last_name,
            "es_admin": user.is_staff  # o user.is_superuser según tu lógica
        })

class ListaHuevosAPIView(APIView):
    def get(self, request):
        huevos = Huevo.objects.all()
        conteo = {"S": 0, "M": 0, "L": 0, "XL": 0}

        for huevo in huevos:
            categoria = huevo.categoria.strip()
            if categoria in conteo:
                conteo[categoria] += 1

        return Response(conteo)
    
class RegisterUser(APIView):
    def post(self, request):
        data = request.data
        print("Datos recibidos en el backend:", data)

        email = data.get("email")
        password = data.get("password")
        username = data.get("username")
        nombre = data.get("nombre")
        direccion = data.get("direccion")
        telefono = data.get("telefono")
        codigo_admin = data.get("codigo_admin")
        rol = data.get("rol", "cliente")  # ← Usa "cliente" como predeterminado

        if not email or not password:
            return Response({"error": "Campos requeridos"}, status=400)

        if CustomUser.objects.filter(email=email).exists():
            return Response({"error": "Usuario ya existe"}, status=400)

        es_admin = codigo_admin == "ADMIN123"
        if es_admin:
            rol = "admin"

        try:
            user = CustomUser.objects.create_user(
                email=email,
                password=password,
                username=username,
                nombre=nombre,
                direccion=direccion,
                telefono=telefono,
                is_staff=es_admin,
                is_superuser=es_admin,
                rol=rol,
            )
            return Response({"message": "Usuario creado correctamente"}, status=201)
        except Exception as e:
            print("❌ Error al crear usuario:", str(e))
            return Response({"error": str(e)}, status=400)

class RegistrarGranjaYPropietario(APIView):
    def post(self, request):
        data = request.data

        # Datos del propietario
        email = data.get("email")
        password = data.get("password")
        nombre = data.get("nombre_propietario")
        direccion = data.get("direccion")
        telefono = data.get("telefono_propietario")

        # Datos de la granja
        nombre_granja = data.get("nombre_granja")
        ubicacion = data.get("ubicacion")
        telefono_granja = data.get("telefono_granja")
        descripcion = data.get("descripcion")

        if not all([email, password, nombre, direccion, telefono, nombre_granja, ubicacion, telefono_granja, descripcion]):
            return Response({"error": "Faltan datos obligatorios"}, status=400)

        if CustomUser.objects.filter(email=email).exists():
            return Response({"error": "El email ya está registrado"}, status=400)

        try:
            user = CustomUser.objects.create_user(
                email=email,
                password=password,
                nombre=nombre,
                direccion=direccion,
                telefono=telefono,
                rol="propietario"
            )

            Granja.objects.create(
                nombre=nombre_granja,
                ubicacion=ubicacion,
                telefono=telefono_granja,
                descripcion=descripcion,
                propietario=user
            )

            return Response({"message": "Granja y propietario registrados con éxito"}, status=201)
        except Exception as e:
            return Response({"error": str(e)}, status=500)
        
class SetGranjaActualView(APIView):
    def post(self, request):
        granja_id = request.data.get("id")

        try:
            if not granja_id:
                raise ValueError("ID de granja no proporcionado")

            # Asegurar que sea entero
            granja_id = int(granja_id)

            # Ruta absoluta al archivo (recomendado)
            ruta = os.path.join(os.path.dirname(__file__), "current_granja.json")

            with open(ruta, "w") as f:
                json.dump({"granja_id": granja_id}, f)

            return Response({"status": "✅ Granja actualizada"})
        except Exception as e:
            print("❌ Error al guardar la granja:", e)
            return Response({"error": str(e)}, status=500)

# API que lista todas las granjas (admin)
class ListaGranjasAPIView(APIView):
    def get(self, request):
        granjas = Granja.objects.all()
        return Response([{"id": g.id, "nombre": g.nombre} for g in granjas])

# API que retorna la(s) granja(s) del propietario
class MisGranjasAPIView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        propietario_id = request.query_params.get('propietario_id')
        print(propietario_id)
        if not propietario_id:
            return Response({"error": "Falta parámetro propietario_id"}, status=400)

        granjas = Granja.objects.filter(propietario__id=propietario_id)
        return Response([{"id": g.id, "nombre": g.nombre} for g in granjas])
    
def conteo_huevos_por_granja(request, granja_id):
    huevos = Huevo.objects.filter(granja_id=granja_id)
    conteo = {"S": 0, "M": 0, "L": 0, "XL": 0}

    for h in huevos:
        categoria = h.categoria.strip().upper()
        if categoria in conteo:
            conteo[categoria] += 1

    return JsonResponse(conteo)

class ResumenHuevosAPIView(APIView):
    def get(self, request):
        granja_id = request.GET.get("granja_id")

        if not granja_id:
            return Response({"error": "Falta granja_id"}, status=400)

        hoy = timezone.now().date()
        hace_un_mes = hoy - timedelta(days=30)

        huevos = Huevo.objects.filter(granja_id=granja_id)

        categorias = ["S", "M", "L", "XL"]
        resumen = []

        for cat in categorias:
            total = huevos.filter(categoria=cat).count()
            mes = huevos.filter(categoria=cat, fecha__date__gte=hace_un_mes).count()
            hoy_count = huevos.filter(categoria=cat, fecha__date=hoy).count()
            # Aquí puedes agregar lógica de stock real si tienes un campo para eso
            stock = total  # Si todos están en stock, por ahora igualamos

            resumen.append({
                "categoria": cat,
                "clasificados_hoy": hoy_count,
                "clasificados_mes": mes,
                "total": total,
                "stock": stock
            })

        return Response(resumen)

class StockMaplesView(APIView):
    def get(self, request):
        try:
            tipos = ["S", "M", "L", "XL"]
            data = []

            for tipo in tipos:
                huevos_no_vendidos = Huevo.objects.filter(categoria=tipo, vendido=False).count()
                maples = huevos_no_vendidos // 30  # cada maple tiene 30 huevos
                print(f"🧪 {tipo}: {huevos_no_vendidos} huevos no vendidos")
                sobrantes = huevos_no_vendidos % 30

                data.append({
                    "tipo": tipo,
                    "huevos": huevos_no_vendidos,
                    "maples": maples,
                    "sobrantes": sobrantes,
                })

            return Response(data)
        except Exception as e:
            print("🔥 Error al calcular stock de maples:", e)
            return Response({"error": str(e)}, status=500)


from random import uniform

class AgregarMapleManualView(APIView):
    def post(self, request):
        tipo = request.data.get("tipo")
        if tipo not in ["S", "M", "L", "XL"]:
            return Response({"error": "Tipo inválido"}, status=400)

        try:
            # Valores estimados de peso y radio según tipo
            valores = {
                "S": {"peso": (40, 45), "radio": (2.0, 2.2)},
                "M": {"peso": (46, 50), "radio": (2.2, 2.4)},
                "L": {"peso": (51, 55), "radio": (2.4, 2.6)},
                "XL": {"peso": (56, 60), "radio": (2.6, 2.8)},
            }

            huevos = []
            for _ in range(30):
                peso = round(uniform(*valores[tipo]["peso"]), 2)
                radio = round(uniform(*valores[tipo]["radio"]), 2)

                huevo = Huevo(
                    categoria=tipo,
                    peso=peso,
                    radio=radio,
                    vendido=False,
                    granja=None  # Puedes asignar una granja si lo deseas
                )
                huevos.append(huevo)

            Huevo.objects.bulk_create(huevos)

            return Response({"status": f"✅ Maple tipo {tipo} agregado correctamente"})

        except Exception as e:
            print("🔥 Error al agregar maple:", e)
            return Response({"error": str(e)}, status=500)

class MarcarVendidosView(APIView):
    def post(self, request):
        producto = request.data.get("producto")
        cantidad = int(request.data.get("unidades", 1))

        try:
            huevos = Huevo.objects.filter(categoria=producto, vendido=False)[:cantidad]
            for h in huevos:
                h.vendido = True
                h.save()

            return Response({"status": f"{len(huevos)} huevos marcados como vendidos."})
        except Exception as e:
            print("🔥 Error al marcar vendidos:", e)
            return Response({"error": str(e)}, status=500)

class PreciosMapleView(APIView):
    def get(self, request):
        precios = PrecioMaple.objects.all()
        data = [{"tipo": p.tipo, "precio": p.precio} for p in precios]
        return Response(data)

    def post(self, request):
        try:
            print("📥 Datos recibidos en POST:", request.data)

            for item in request.data:
                tipo = item.get("tipo")
                precio = item.get("precio")

                if tipo is None or precio is None:
                    continue  # saltar datos incompletos

                try:
                    precio_float = float(precio)
                except (ValueError, TypeError):
                    return Response(
                        {"error": f"Precio inválido para tipo {tipo}"},
                        status=400
                    )

                # ⚠️ Importante: separar get y create
                obj = PrecioMaple.objects.filter(tipo=tipo).first()

                if obj:
                    obj.precio = precio_float
                    obj.save()
                else:
                    PrecioMaple.objects.create(tipo=tipo, precio=precio_float)

            return Response({"status": "✅ Precios actualizados correctamente"})

        except Exception as e:
            print("🔥 Error al actualizar precios:", e)
            return Response({"error": str(e)}, status=500)



class ReporteHuevosPDF(APIView):
    def get(self, request):
        granja_id = request.GET.get("granja_id")
        fecha_inicio = request.GET.get("fecha_inicio")
        fecha_fin = request.GET.get("fecha_fin")

        if not all([granja_id, fecha_inicio, fecha_fin]):
            return Response({"error": "Faltan parámetros"}, status=400)

        # Obtener objeto granja para su nombre
        try:
            granja = Granja.objects.get(id=granja_id)
            nombre_granja = granja.nombre
        except Granja.DoesNotExist:
            nombre_granja = "Granja desconocida"

        fecha_i = datetime.strptime(fecha_inicio, "%Y-%m-%d")
        fecha_f = datetime.strptime(fecha_fin, "%Y-%m-%d")

        huevos = Huevo.objects.filter(
            granja_id=granja_id, 
            fecha__date__gte=fecha_i, 
            fecha__date__lte=fecha_f
        )

        categorias = ["PEQUEÑO", "MEDIANO", "GRANDE", "EXTRA GRANDE"]
        data = [["Categoría", "Cantidad total", "Vendidos", "Stock"]]

        for cat in categorias:
            total = huevos.filter(categoria=cat).count()
            vendidos = huevos.filter(categoria=cat, vendido=True).count()
            stock = total - vendidos
            data.append([cat, total, vendidos, stock])

        # Crear PDF en memoria
        buffer = io.BytesIO()
        doc = SimpleDocTemplate(
            buffer,
            pagesize=A4,
            leftMargin=40,
            rightMargin=40,
            topMargin=50,
            bottomMargin=50
        )
        elements = []

        # Nombre de la granja alineado a la izquierda
        style_granja = ParagraphStyle(
            name="GranjaTitle",
            fontSize=18,
            leading=22,
            alignment=0  # izquierda
        )
        elements.append(Paragraph(f"🏡 {nombre_granja}", style_granja))
        elements.append(Spacer(1, 6))

        # Título del reporte más pequeño, alineado a la izquierda
        style_reporte = ParagraphStyle(
            name="ReporteTitle",
            fontSize=12,
            leading=14,
            alignment=0  # izquierda
        )
        elements.append(Paragraph(f"📄 Reporte de Huevos ({fecha_inicio} a {fecha_fin})", style_reporte))
        elements.append(Spacer(1, 12))

        # Tabla ocupando todo el ancho de la hoja
        ancho_total = A4[0] - doc.leftMargin - doc.rightMargin
        tabla = Table(data, colWidths=[ancho_total/len(data[0])]*len(data[0]))

        # Estilo de tabla con filas alternadas gris suave
        style = TableStyle([
            ("BACKGROUND", (0, 0), (-1, 0), colors.lightgrey),  # encabezado
            ("TEXTCOLOR", (0, 0), (-1, 0), colors.black),
            ("ALIGN", (0, 0), (-1, -1), "CENTER"),
            ("GRID", (0, 0), (-1, -1), 1, colors.black),
            ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
        ])

        # Aplicar gris alternado en las filas de datos
        for i in range(1, len(data)):
            if i % 2 == 0:
                bg_color = colors.HexColor("#DDEEFF")  # celeste suave
            else:
                bg_color = colors.white
            style.add("BACKGROUND", (0, i), (-1, i), bg_color)

        tabla.setStyle(style)
        elements.append(tabla)

        doc.build(elements)
        pdf = buffer.getvalue()
        buffer.close()

        response = HttpResponse(pdf, content_type="application/pdf")
        response["Content-Disposition"] = f'attachment; filename="reporte_huevos_{fecha_inicio}_a_{fecha_fin}.pdf"'
        return response