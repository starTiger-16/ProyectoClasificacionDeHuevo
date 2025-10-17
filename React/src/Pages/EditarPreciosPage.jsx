import React, { useEffect, useState } from "react";
import axios from "axios";
import NavBar from "../Components/Navbar";

const API_URL = import.meta.env.VITE_API_URL;

export function EditarPreciosPage() {
  // Guarda precios como string para controlar inputs vacíos
  const [precios, setPrecios] = useState([
    { tipo: "S", precio: "0" },
    { tipo: "M", precio: "0" },
    { tipo: "L", precio: "0" },
    { tipo: "XL", precio: "0" },
  ]);
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    fetchPrecios();
  }, []);

  const fetchPrecios = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/precios-maple/`);
      setPrecios((prev) =>
        prev.map((p) => {
          const actualizado = response.data.find((d) => d.tipo === p.tipo);
          return actualizado
            ? { ...p, precio: actualizado.precio.toString() }
            : p;
        })
      );
    } catch (error) {
      console.error("Error al cargar precios:", error);
      setMensaje("❌ Error al cargar precios");
    }
  };

  const actualizarPrecio = (tipo, nuevoPrecio) => {
    // Acepta strings para manejar vacíos
    setPrecios((prev) =>
      prev.map((p) => (p.tipo === tipo ? { ...p, precio: nuevoPrecio } : p))
    );
  };

  const guardarCambios = async () => {
    try {
      // Filtra y convierte solo los válidos
      const datosAEnviar = precios
        .filter(
          (p) =>
            p.precio !== null &&
            p.precio !== "" &&
            !isNaN(parseFloat(p.precio)) &&
            parseFloat(p.precio) >= 0
        )
        .map((p) => ({
          tipo: p.tipo,
          precio: parseFloat(p.precio),
        }));

      console.log("📤 Enviando precios:", datosAEnviar);

      await axios.post(`${API_URL}/api/precios-maple/`, datosAEnviar, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      setMensaje("✅ Precios guardados");
    } catch (error) {
      console.error("Error al guardar precios:", error);
      setMensaje("❌ Error al guardar precios");
    }
  };

  return (
    <div>
      <NavBar />
      <div className="p-6 max-w-xl mx-auto bg-white rounded shadow">
        <h1 className="text-2xl font-bold mb-4">Editar Precios de Maples</h1>

        {mensaje && (
          <p
            className={`mb-4 ${
              mensaje.includes("✅")
                ? "text-green-600"
                : "text-red-600"
            }`}
          >
            {mensaje}
          </p>
        )}

        {precios.map((p) => (
          <div key={p.tipo} className="mb-3">
            <label className="block font-semibold mb-1">
              Precio para tipo {p.tipo}:
            </label>
            <input
              type="number"
              value={p.precio}
              onChange={(e) => actualizarPrecio(p.tipo, e.target.value)}
              className="border p-2 w-full rounded"
              step="0.01"
              min="0"
            />
          </div>
        ))}

        <button
          onClick={guardarCambios}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mt-4"
        >
          Guardar Cambios
        </button>
      </div>
    </div>
  );
}
