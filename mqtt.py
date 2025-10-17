# mqtt_listener.py
import os
import django
import json
import threading
import time
import paho.mqtt.client as mqtt
from django.utils import timezone

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "django_crud.settings")
django.setup()

from task.models import Huevo, EstadoMaquina, Granja

# Este valor se actualiza cada vez que se recibe "ONLINE"
ultima_conexion = timezone.now()

# Función para obtener el ID de la granja seleccionada desde archivo
def obtener_granja_actual():
    try:
        with open("./task/current_granja.json", "r") as f:
            data = json.load(f)
            return data.get("granja_id")
    except Exception as e:
        print("⚠️ No se pudo obtener la granja actual:", e)
        return None

# Callback cuando se conecta al broker MQTT
def on_connect(client, userdata, flags, rc):
    print("📡 MQTT conectado")
    client.subscribe("maquina/huevo")
    client.subscribe("maquina/status")
    client.subscribe("maquina/conexion")

# Callback cuando llega un mensaje por MQTT
def on_message(client, userdata, msg):
    global ultima_conexion

    topic = msg.topic
    payload = msg.payload.decode()

    if topic == "maquina/huevo":
        try:
            data = json.loads(payload)

            # Obtener la granja seleccionada
            granja_id = obtener_granja_actual()
            granja = Granja.objects.get(id=granja_id) if granja_id else None

            # Crear el huevo asociado a esa granja
            Huevo.objects.create(
                radio=data["radio"],
                peso=data["peso"],
                categoria=data["categoria"],
                granja=granja
            )
            print(f"🥚 Huevo registrado para granja ID {granja_id}: {data}")

        except Exception as e:
            print("❌ Error al registrar huevo:", e)

    elif topic == "maquina/status":
        try:
            encendida = payload.upper() == "ON"
            estado = EstadoMaquina.objects.last()
            if not estado:
                EstadoMaquina.objects.create(encendida=encendida)
            else:
                estado.encendida = encendida
                estado.save()
            print(f"🔌 Estado actualizado: Encendida = {encendida}")
        except Exception as e:
            print("❌ Error al actualizar estado:", e)

    elif topic == "maquina/conexion":
        try:
            estado = EstadoMaquina.objects.last()
            if not estado:
                estado = EstadoMaquina.objects.create(online=True)
            else:
                estado.online = True
                estado.save()
            ultima_conexion = timezone.now()
            print("🟢 Conexión actualizada: Online = True")
        except Exception as e:
            print("❌ Error al actualizar conexión:", e)

# Verificar si la máquina sigue online (basado en el tiempo de la última conexión)
def verificar_conexion():
    global ultima_conexion
    while True:
        time.sleep(2)
        try:
            estado = EstadoMaquina.objects.last()
            if estado:
                tiempo_inactivo = timezone.now() - ultima_conexion
                if tiempo_inactivo.total_seconds() > 5 and estado.online:
                    estado.online = False
                    estado.encendida = False
                    estado.save()
                    print("🔴 Máquina marcada como OFFLINE por inactividad")
        except Exception as e:
            print("❌ Error al verificar conexión:", e)

# Iniciar hilo de verificación
verificador = threading.Thread(target=verificar_conexion, daemon=True)
verificador.start()

# Conectar al broker MQTT y escuchar mensajes
client = mqtt.Client()
client.on_connect = on_connect
client.on_message = on_message
client.connect("localhost", 1883, 60)
client.loop_forever()
