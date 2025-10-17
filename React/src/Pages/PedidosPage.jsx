// src/Pages/PedidosPage.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import NavBar from "../Components/Navbar";

const API_URL = import.meta.env.VITE_API_URL;

export function PedidosPage() {
  const [pedidos, setPedidos] = useState([]);
  const [seleccionados, setSeleccionados] = useState([]);

  useEffect(() => {
    fetchPedidos();
  }, []);

  const fetchPedidos = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/pedidos/lista/`);
      setPedidos(response.data);
      console.log("🧾 Pedidos cargados:", response.data);
    } catch (error) {
      console.error("Error al obtener pedidos", error);
    }
  };

  const toggleSeleccion = (id) => {
    setSeleccionados((prev) =>
      prev.includes(id) ? prev.filter((sel) => sel !== id) : [...prev, id]
    );
  };

  const eliminarSeleccionados = async () => {
    try {
      for (const id of seleccionados) {
        await axios.delete(`${API_URL}/api/pedidos/${id}/`);
      }
      fetchPedidos();
      setSeleccionados([]);
    } catch (error) {
      console.error("Error al eliminar pedidos", error);
    }
  };

  return (
    <div>
      <NavBar />
      <div className="bg-green-100 p-6">
        <h1 className="text-2xl font-bold mb-4">Lista de pedidos</h1>
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-2">Seleccionar</th>
              <th className="border px-2">Usuario</th>
              <th className="border px-2">Producto</th>
              <th className="border px-2">Unidades</th>
              <th className="border px-2">Precio Unitario</th>
              <th className="border px-2">Costo Total</th>
              <th className="border px-2">Fecha</th>
            </tr>
          </thead>
          <tbody>
            {pedidos.map((pedido) => (
              <tr key={pedido.id}>
                <td className="border px-2 text-center">
                  <input
                    type="checkbox"
                    checked={seleccionados.includes(pedido.id)}
                    onChange={() => toggleSeleccion(pedido.id)}
                  />
                </td>
                <td className="border px-2">{pedido.usuario}</td>
                <td className="border px-2">{pedido.producto}</td>
                <td className="border px-2 text-center">{pedido.unidades}</td>
                <td className="border px-2 text-center">Bs. {pedido.costo_unitario.toFixed(2)}</td>
                <td className="border px-2 text-center">Bs. {pedido.costo_total.toFixed(2)}</td>
                <td className="border px-2">{new Date(pedido.fecha).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="pt-4">
          <button
            onClick={eliminarSeleccionados}
            disabled={seleccionados.length === 0}
            className="bg-red-500 text-white px-4 py-2 rounded mb-4"
          >
            Eliminar seleccionados
          </button>
        </div>
      </div>
    </div>
  );
}
