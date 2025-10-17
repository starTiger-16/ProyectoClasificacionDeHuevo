import React, { useEffect, useState } from "react";
import NavBar from "../Components/Navbar";
import MapleCard from "../Components/MapleCard";
import maple1 from "../assets/Maple1.jpeg";
import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;

export function ProductosPage() {
  const [maples, setMaples] = useState([]);

  useEffect(() => {
    fetchPrecios();
  }, []);

  const fetchPrecios = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/precios-maple/`);
      const precios = response.data;

      const data = [
        { tipo: "S", nombre: "Maple Pequeño", imagen: maple1 },
        { tipo: "M", nombre: "Maple Mediano", imagen: maple1 },
        { tipo: "L", nombre: "Maple Grande", imagen: maple1 },
        { tipo: "XL", nombre: "Maple Extragrande", imagen: maple1 },
      ];

      const productosConPrecios = data.map((maple) => {
        const precio = precios.find((p) => p.tipo === maple.tipo)?.precio || 0;
        return { ...maple, precio };
      });

      setMaples(productosConPrecios);
    } catch (error) {
      console.error("Error al cargar precios:", error);
    }
  };

  return (
    <div>
      <NavBar />
      <div className="p-6 flex flex-wrap gap-6 justify-center">
        {maples.map((maple, idx) => (
          <MapleCard key={idx} {...maple} />
        ))}
      </div>
    </div>
  );
}
