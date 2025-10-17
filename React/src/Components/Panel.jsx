import React, { useEffect, useState } from "react";
import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;

const Panel = () => {
  const [estado, setEstado] = useState("Apagado");
  const [conexion, setConexion] = useState("Offline");

  const fetchEstado = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/estado/`);
      setEstado(res.data.encendida ? "Encendido" : "Apagado");
      setConexion(res.data.online ? "Online" : "Offline");
    } catch (error) {
      console.error("Error al obtener estado:", error);
    }
  };

  useEffect(() => {
    fetchEstado();
    const intervalo = setInterval(fetchEstado, 3000); // actualizar cada 3 segundos
    return () => clearInterval(intervalo);
  }, []);

  // Clases dinámicas para los rectángulos
  const conexionClass =
    conexion === "Online" ? "bg-green-600" : "bg-red-600";

  const estadoClass =
    estado === "Encendido" ? "bg-green-600" : "bg-red-600";

  return (
    <div className="bg-white w-full h-full p-6 rounded-lg flex flex-col items-center space-y-6">
      <h1 className="text-center text-xl font-bold">Estado de la maquina</h1>
      {/* Estado de conexión */}
      <div className={`${conexionClass} p-4 rounded w-full text-center`}>
        {" "}
        <span className={conexion === "Online" ? "font-bold text-white" : "font-bold text-white"}>
          {conexion}
        </span>
      </div>

      {/* Estado de funcionamiento */}
      <div className={`${estadoClass} p-4 rounded w-full text-center`}>
        {" "}
        <span className={estado === "Encendido" ? "font-bold text-white" : "font-bold text-white"}>
          {estado}
        </span>
      </div>
    </div>
  );
};

export default Panel;
