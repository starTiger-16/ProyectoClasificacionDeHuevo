// src/components/LoginCard.jsx
import React, { useState } from "react";
import granja from "../assets/granja.jpeg";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const API_URL = import.meta.env.VITE_API_URL;
const LoginCard = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `${API_URL}/api/login/`,
        { email, password }, // 👈 el cuerpo del request
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true, // 👈 esto sí funciona con axios
        }
      );

      const userInfo = response.data;
      localStorage.setItem("user", JSON.stringify(userInfo));
      
      const rol = userInfo?.rol;

      if (rol === "admin" || rol === "propietario") {
        navigate("/Monitor");
      } else {
        navigate("/Productos");
      }

    } catch (error) {
      setMessage("Credenciales inválidas");
      console.error("❌ Error en login:", error);
    }
  };

  return (
    <div className="h-3/4 w-full md:w-2/3 bg-white shadow-lg rounded-lg flex flex-col md:flex-row">
      {/* Imagen a la izquierda */}
      <div className="hidden md:block md:w-1/2 bg-gray-300 rounded-l-lg">
        {/* Aquí puedes agregar la imagen */}
        <img
          src={granja} // Cambia esto con la URL de tu imagen
          alt="Login"
          className="w-full h-full object-cover rounded-l-lg"
        />
      </div>

      {/* Formulario de login a la derecha */}
      <div className="w-full md:w-1/2 p-6 flex flex-col justify-center items-center">
        <h2 className="text-2xl font-semibold mb-6">Iniciar sesión</h2>

        <form onSubmit={handleSubmit} className="w-full">
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium">
              Correo electrónico
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full mt-2 p-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-medium">
              Contraseña
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full mt-2 p-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Iniciar sesión
          </button>
          {message && (
            <div className="mt-4 text-center text-sm text-red-600">
              {message}
            </div>
          )}
          <div className="mt-4 text-center">
            <span className="text-sm text-gray-600">
              ¿No tienes una cuenta?{" "}
              <span
                className="text-blue-600 hover:underline cursor-pointer"
                onClick={() => navigate("/Singin")}
              >
                Registrarse
              </span>
            </span>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginCard;
