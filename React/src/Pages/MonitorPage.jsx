import React, { useEffect, useState } from "react";
import NavBar from "../Components/Navbar";
import Panel from "../Components/Panel";
import Gauge from "../Components/Gauge";
import CardContainer from "../Components/CardContainer";

const API_URL = import.meta.env.VITE_API_URL;

export function MonitorPage() {
  const [valor, setValor] = useState(0);
  const maximo = 11;

  const [granjas, setGranjas] = useState([]);
  const [granjaSeleccionada, setGranjaSeleccionada] = useState(null);
  const [rol, setRol] = useState(null);
  const [usuarioId, setUsuarioId] = useState(null); // nuevo estado para ID usuario

  // Obtener rol e id desde localStorage
  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      const user = JSON.parse(userStr);
      setRol(user?.rol);
      setUsuarioId(user?.id); // guardamos el id
    }
  }, []);

  // Lógica para cargar granjas y establecer la activa
useEffect(() => {
  console.log(rol);
  console.log(usuarioId);
  if (!rol) return;

  if (rol === "admin") {
    fetch(`${API_URL}/api/granjas`)
      .then((res) => res.json())
      .then(setGranjas);
  } else if (rol === "propietario") {
    if (!usuarioId) return;

    fetch(`${API_URL}/api/mis-granjas?propietario_id=${usuarioId}`)
      .then((res) => res.json())
      .then((data) => {
        console.log("Granjas obtenidas para propietario:", data); // <-- log
        if (data.length > 0) {
          const id = data[0].id;
          console.log("Granja seleccionada:", id);  // <-- log
          setGranjaSeleccionada(id);
          actualizarGranjaEnServidor(id);
          setGranjas(data);
        } else {
          console.warn("No se encontraron granjas para el propietario.");
        }
      })
      .catch((error) => {
        console.error("Error cargando granjas del propietario:", error);
      });
  }
}, [rol, usuarioId]);


  // Enviar ID de granja activa al backend para que el MQTT la lea
  function actualizarGranjaEnServidor(id) {
    fetch(`${API_URL}/api/set-granja-actual`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
  }

  // Obtener velocidad de clasificación filtrada por granja
  useEffect(() => {
    if (!granjaSeleccionada) return;

    const interval = setInterval(() => {
      fetch(`${API_URL}/api/velocidad/${granjaSeleccionada}/`)
        .then((res) => res.json())
        .then((data) => setValor(data.velocidad))
        .catch((err) => console.error("Error al obtener la velocidad:", err));
    }, 1000);

    return () => clearInterval(interval);
  }, [granjaSeleccionada]);

  return (
    <div>
      <NavBar />

      {/* Select de granjas visible solo para admin */}
      {rol === "admin" && (
        <div className="m-4">
          <select
            id="granja-select"
            className="bg-white border p-2 rounded w-64"
            onChange={(e) => {
              const id = parseInt(e.target.value);
              if (!isNaN(id)) {
                setGranjaSeleccionada(id);
                actualizarGranjaEnServidor(id);
              }
            }}
            value={granjaSeleccionada || ""}
          >
            <option value="">-- Selecciona una granja --</option>
            {granjas.map((g) => (
              <option key={g.id} value={g.id}>
                {g.nombre}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Panel de monitoreo */}
      <div className="px-4 flex items-center space-x-0 md:space-x-8 flex-col md:flex-row">
        <Panel />
        <Gauge valor={valor} maximo={maximo} />
      </div>

      <CardContainer granjaId={granjaSeleccionada} />
    </div>
  );
}
