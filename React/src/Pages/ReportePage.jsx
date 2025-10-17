import React, { useEffect, useState } from "react";
import NavBar from "../Components/Navbar";
const API_URL = import.meta.env.VITE_API_URL;

export function ReportePage() {
  const [resumen, setResumen] = useState([]);
  const [granjas, setGranjas] = useState([]);
  const [granjaId, setGranjaId] = useState(null);
  const [rol, setRol] = useState(null);
  const [usuarioId, setUsuarioId] = useState(null);
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      setRol(user.rol);
      setUsuarioId(user.id);
    }
  }, []);

  useEffect(() => {
    if (!rol || !usuarioId) return;

    const url =
      rol === "admin"
        ? `${API_URL}/api/granjas`
        : `${API_URL}/api/mis-granjas?propietario_id=${usuarioId}`;

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        setGranjas(data);
        if (data.length > 0) setGranjaId(data[0].id);
      });
  }, [rol, usuarioId]);

  useEffect(() => {
    if (!granjaId) return;

    fetch(`${API_URL}/api/resumen-huevos?granja_id=${granjaId}`)
      .then((res) => res.json())
      .then(setResumen);
  }, [granjaId]);

  const descargarPDF = async () => {
    if (!fechaInicio || !fechaFin) {
      alert("Por favor selecciona ambas fechas.");
      return;
    }

    const url = `${API_URL}/api/reporte-huevos-pdf?granja_id=${granjaId}&fecha_inicio=${fechaInicio}&fecha_fin=${fechaFin}`;
    const res = await fetch(url);
    if (!res.ok) {
      alert("Error al generar el PDF");
      return;
    }

    // Descargar PDF
    const blob = await res.blob();
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `reporte_huevos_${fechaInicio}_a_${fechaFin}.pdf`;
    link.click();
  };

  return (
    <div>
      <NavBar />
      <div className="bg-white p-2 mt-6">
        <h1 className="text-xl font-bold mb-4">Resumen de huevos clasificados</h1>

        {rol === "admin" && (
          <div className="mb-4">
            <label className="mr-2">Granja:</label>
            <select
              className="border p-2 rounded"
              value={granjaId || ""}
              onChange={(e) => setGranjaId(e.target.value)}
            >
              {granjas.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.nombre}
                </option>
              ))}
            </select>
          </div>
        )}

        <table className="w-full table-auto border border-gray-300 text-center">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">Categoría</th>
              <th className="p-2 border">Hoy</th>
              <th className="p-2 border">Último mes</th>
              <th className="p-2 border">Total</th>
              <th className="p-2 border">Stock</th>
            </tr>
          </thead>
          <tbody>
            {resumen.map((item, i) => (
              <tr key={i}>
                <td className="border p-2">{item.categoria}</td>
                <td className="border p-2">{item.clasificados_hoy}</td>
                <td className="border p-2">{item.clasificados_mes}</td>
                <td className="border p-2">{item.total}</td>
                <td className="border p-2">{item.stock}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* 🔹 Campos de fecha + botón */}
        <div className="mt-4 flex flex-col sm:flex-row items-center gap-2">
          <div>
            <label className="mr-2">Desde:</label>
            <input
              type="date"
              value={fechaInicio}
              onChange={(e) => setFechaInicio(e.target.value)}
              className="border p-2 rounded"
            />
          </div>
          <div>
            <label className="mr-2">Hasta:</label>
            <input
              type="date"
              value={fechaFin}
              onChange={(e) => setFechaFin(e.target.value)}
              className="border p-2 rounded"
            />
          </div>
          <button
            onClick={descargarPDF}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Descargar PDF
          </button>
        </div>
      </div>
    </div>
  );
}