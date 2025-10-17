import React, { useEffect, useState } from "react";
import NavBar from "../Components/Navbar";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export function StockPage() {
  const [stock, setStock] = useState([]);
  const [mensaje, setMensaje] = useState("");

  const tipos = ["S", "M", "L", "XL"];

  useEffect(() => {
    fetchStock();
  }, []);

  const fetchStock = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/stock-maples/`);
      setStock(response.data);
    } catch (error) {
      console.error("Error al cargar el stock:", error);
    }
  };

  const agregarMaple = async (tipo) => {
    try {
      await axios.post(`${API_URL}/api/agregar-maple/`, { tipo });
      setMensaje(`✅ Maple tipo ${tipo} agregado correctamente`);
      fetchStock();
    } catch (error) {
      console.error("Error al agregar maple:", error);
      setMensaje("❌ Error al agregar maple");
    }
  };

  return (
    <div>
      <NavBar />
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Stock de Maples</h1>

        {mensaje && <p className="text-green-600 font-semibold mb-4">{mensaje}</p>}

        <table className="w-full table-auto border border-gray-300 text-center bg-white rounded-lg shadow">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-2 border">Tipo</th>
              <th className="p-2 border">Maples en Stock</th>
              <th className="p-2 border">Agregar Maple</th>
            </tr>
          </thead>
          <tbody>
            {tipos.map((tipo, index) => {
              const cantidad = stock.find((m) => m.tipo === tipo)?.maples || 0;
              return (
                <tr
                  key={tipo}
                  className={index % 2 === 0 ? "bg-gray-50" : "bg-gray-100"}
                >
                  <td className="border p-2">{tipo}</td>
                  <td className="border p-2">{cantidad}</td>
                  <td className="border p-2">
                    <button
                      onClick={() => agregarMaple(tipo)}
                      className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                    >
                      +1 Maple
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

      </div>
    </div>
  );
}
