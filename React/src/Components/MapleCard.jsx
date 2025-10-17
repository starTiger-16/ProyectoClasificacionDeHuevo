// src/Components/MapleCard.jsx
import React, { useState } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const MapleCard = ({ tipo, nombre, imagen, precio }) => {
  const [cantidad, setCantidad] = useState(1);
  const [mensaje, setMensaje] = useState("");
  const user = JSON.parse(localStorage.getItem("user"));
  const email = user?.email || "";
  const granja = "General"; // si no hay granja, usa algo genérico

  const handleCantidad = (operacion) => {
    setCantidad((prev) => Math.max(1, prev + (operacion === "+" ? 1 : -1)));
  };

  const enviarPedido = async () => {
    try {
      await axios.post(`${API_URL}/api/pedidos/`, {
        producto: nombre,
        granja,
        usuario: email,
        unidades: cantidad,
        costo_unitario: precio,
        costo_total: cantidad * precio,
      }, {
        withCredentials: true,
      });

      setMensaje(`✅ Pedido de ${cantidad}x ${nombre} registrado`);
    } catch (error) {
      console.error("❌ Error al enviar el pedido:", error);
      setMensaje("❌ Error al enviar el pedido");
    }
  };

  return (
    <div className="rounded-xl shadow p-4 bg-white w-full sm:w-72 flex flex-col items-center">
      <img src={imagen} alt={nombre} className="w-24 h-24 rounded object-cover" />
      <h3 className="text-lg font-bold mt-2">{nombre}</h3>
      <p className="text-sm text-gray-600 mb-1">Contiene 30 huevos</p>
      <p className="text-gray-800 font-semibold">Bs. {precio}</p>

      <div className="flex gap-2 items-center mt-2">
        <button onClick={() => handleCantidad("-")} className="bg-gray-200 px-2 rounded">−</button>
        <span>{cantidad}</span>
        <button onClick={() => handleCantidad("+")} className="bg-gray-200 px-2 rounded">+</button>
      </div>

      <button
        onClick={enviarPedido}
        className="mt-3 bg-green-500 text-white px-4 py-1 rounded hover:bg-green-600"
      >
        Pedir
      </button>

      {mensaje && <p className="text-sm mt-2 text-blue-600 text-center">{mensaje}</p>}
    </div>
  );
};

export default MapleCard;
