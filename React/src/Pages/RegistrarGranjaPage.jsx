import React, { useState } from "react";
import axios from "axios";
import NavBar from "../Components/Navbar";

const API_URL = import.meta.env.VITE_API_URL;

export function RegistrarGranjaPage() {
  const [formData, setFormData] = useState({
    nombre_granja: "",
    ubicacion: "",
    telefono_granja: "",
    descripcion: "",
    email: "",
    password: "",
    nombre_propietario: "",
    direccion: "",
    telefono_propietario: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_URL}/api/granjas/registrar/`, formData);
      console.log("✅ Registro exitoso", response.data);
      alert("Registro exitoso. Ahora puede iniciar sesión.");
      // Redirigir si deseas: window.location.href = "/login";
    } catch (error) {
      console.error("❌ Error al registrar la granja:", error);
      alert("Error al registrar la granja.");
    }
  };

  return (
    <div>
      <NavBar />
      <div className="max-w-3xl mx-auto mt-8 bg-white p-6 rounded shadow">
        <h2 className="text-2xl font-bold mb-4">Registro de Granja y Propietario</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Datos de la Granja */}
          <h3 className="text-xl font-semibold">Datos de la Granja</h3>
          <input type="text" name="nombre_granja" placeholder="Nombre de la granja" className="w-full border p-2" onChange={handleChange} required />
          <input type="text" name="ubicacion" placeholder="Ubicación" className="w-full border p-2" onChange={handleChange} required />
          <input type="text" name="telefono_granja" placeholder="Teléfono" className="w-full border p-2" onChange={handleChange} required />
          <textarea name="descripcion" placeholder="Descripción de la granja" className="w-full border p-2" onChange={handleChange} required />

          {/* Datos del Propietario */}
          <h3 className="text-xl font-semibold mt-4">Datos del Propietario</h3>
          <input type="email" name="email" placeholder="Email" className="w-full border p-2" onChange={handleChange} required />
          <input type="password" name="password" placeholder="Contraseña" className="w-full border p-2" onChange={handleChange} required />
          <input type="text" name="nombre_propietario" placeholder="Nombre completo" className="w-full border p-2" onChange={handleChange} required />
          <input type="text" name="direccion" placeholder="Dirección" className="w-full border p-2" onChange={handleChange} required />
          <input type="text" name="telefono_propietario" placeholder="Teléfono" className="w-full border p-2" onChange={handleChange} required />

          <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">Registrar</button>
        </form>
      </div>
    </div>
  );
}
