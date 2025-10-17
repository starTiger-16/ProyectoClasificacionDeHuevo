import React, { useEffect, useState } from "react";
import Card from "./Card";
import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;

const CardContainer = ({ granjaId }) => {
  const [conteo, setConteo] = useState({ S: 0, M: 0, L: 0, XL: 0 });

  useEffect(() => {
    if (!granjaId) return;

    const fetchData = () => {
      axios.get(`${API_URL}/api/huevos/${granjaId}/`)
        .then(res => {
          setConteo(res.data);
        })
        .catch(err => console.error(err));
    };

    fetchData();
    const intervalId = setInterval(fetchData, 1000); // cada segundo

    return () => clearInterval(intervalId);
  }, [granjaId]);

  return (
    <div className="bg-[#117a65] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 py-4">
      <Card titulo="Pequeño" cantidad={conteo.S} imagenSize="sm" />
      <Card titulo="Mediano" cantidad={conteo.M} imagenSize="md" />
      <Card titulo="Grande" cantidad={conteo.L} imagenSize="lg" />
      <Card titulo="Extra Grande" cantidad={conteo.XL} imagenSize="xlg" />
    </div>
  );
};

export default CardContainer;
