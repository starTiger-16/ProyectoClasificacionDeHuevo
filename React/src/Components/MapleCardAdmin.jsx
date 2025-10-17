// src/Components/MapleCard.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const MapleCard = ({ tipo, nombre, imagen, precio }) => {
  const [cantidad, setCantidad] = useState(1);
  const navigate = useNavigate();

  const handleCantidad = (operacion) => {
    setCantidad((prev) => Math.max(1, prev + (operacion === "+" ? 1 : -1)));
  };

  const irAPrecios = () => {
    navigate("/Precios");
  };

  const irAStock = () => {
    navigate("/Stock"); // ✅ redirige a la pestaña de Stock
  };

  return (
    <div className="rounded-xl shadow p-4 bg-white w-full sm:w-72 flex flex-col items-center">
      <img src={imagen} alt={nombre} className="w-24 h-24 rounded object-cover" />
      <h3 className="text-lg font-bold mt-2">{nombre}</h3>
      <p className="text-sm text-gray-600 mb-1">Contiene 30 huevos</p>

      <div className="mt-3 flex gap-2">
        <button
          onClick={irAPrecios}
          className="bg-green-500 text-white px-4 py-1 rounded hover:bg-green-600"
        >
          Editar precio
        </button>

        <button
          onClick={irAStock}
          className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600"
        >
          Stock
        </button>
      </div>
    </div>
  );
};

export default MapleCard;
