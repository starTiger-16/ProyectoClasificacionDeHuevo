// src/Pages/CarritoPage.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import NavBar from "../Components/Navbar";
import qr from "../assets/qr.png";
const API_URL = import.meta.env.VITE_API_URL;

export function CarritoPage() {
  const [pedidos, setPedidos] = useState([]);
  const [mensaje, setMensaje] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));
  console.log(user);
  const email = user?.email;

  const [nombre, setNombre] = useState(user.username);
  const [ci, setCi] = useState("1234567");

  useEffect(() => {
    fetchPedidos();
  }, []);

  const fetchPedidos = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/pedidos/lista/`);
      const pedidosUsuario = response.data.filter(p => p.usuario === email);
      setPedidos(pedidosUsuario);
    } catch (error) {
      console.error("Error al obtener pedidos", error);
    }
  };

  const eliminarPedido = async (id) => {
    try {
      await axios.delete(`${API_URL}/api/pedidos/${id}/`);
      setMensaje("✅ Pedido eliminado correctamente");
      fetchPedidos();
    } catch (error) {
      console.error("Error al eliminar pedido", error);
      setMensaje("❌ Error al eliminar pedido");
    }
  };

  const pagar = async () => {
    try {
      for (const pedido of pedidos) {
        await axios.post(`${API_URL}/api/marcar-vendidos/`, {
          producto: pedido.producto,
          unidades: pedido.unidades,
        });

        await axios.delete(`${API_URL}/api/pedidos/${pedido.id}/`);
      }

      setMensaje("✅ Pago realizado exitosamente");
      fetchPedidos();
    } catch (error) {
      console.error("Error al pagar:", error);
      setMensaje("❌ Error al realizar el pago");
    }
  };

  const total = pedidos.reduce((sum, p) => sum + p.costo_total, 0);

  return (
    <div>
      <NavBar />
      <div className="flex flex-col lg:flex-row gap-6 p-6">
        {/* 🛒 Tabla de pedidos */}
        <div className="flex-1 bg-blue-100 p-6 rounded shadow">
          <h1 className="text-2xl font-bold mb-4">Mis Pedidos</h1>

          {mensaje && <p className="text-green-600 mb-4">{mensaje}</p>}

          <table className="w-full border text-center">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-2">Producto</th>
                <th className="border px-2">Unidades</th>
                <th className="border px-2">Precio Unitario</th>
                <th className="border px-2">Costo Total</th>
                <th className="border px-2">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {pedidos.map((pedido) => (
                <tr key={pedido.id}>
                  <td className="border px-2">{pedido.producto}</td>
                  <td className="border px-2">{pedido.unidades}</td>
                  <td className="border px-2">Bs. {pedido.costo_unitario.toFixed(2)}</td>
                  <td className="border px-2">Bs. {pedido.costo_total.toFixed(2)}</td>
                  <td className="border px-2">
                    <button
                      onClick={() => eliminarPedido(pedido.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
              {pedidos.length === 0 && (
                <tr>
                  <td colSpan="5" className="p-4 text-gray-500">No hay pedidos registrados.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* 🧾 Factura */}
        <div className="w-full lg:w-96 bg-white p-6 rounded shadow border">
          <h2 className="text-xl font-bold mb-3">Factura</h2>
          <p className="font-semibold text-lg">{nombre}</p>
          <p className="text-gray-700 mb-3">CI: {ci}</p>

          {/* QR decorativo */}
          <div className="flex justify-center mb-4">
            <img
              src={qr}
              alt="QR"
              className="rounded"
            />
          </div>

          <h3 className="font-semibold mb-2">Detalle:</h3>
          <ul className="text-sm mb-4">
            {pedidos.map((p) => (
              <li key={p.id}>
                {p.unidades}x {p.producto} - Bs. {p.costo_total.toFixed(2)}
              </li>
            ))}
          </ul>

          <p className="font-bold text-right text-lg mb-4">
            Total: Bs. {total.toFixed(2)}
          </p>

          <button
            onClick={pagar}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded font-semibold"
            disabled={pedidos.length === 0}
          >
            Pagar
          </button>
        </div>
      </div>
    </div>
  );
}
