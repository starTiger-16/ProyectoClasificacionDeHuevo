// src/components/RegisterCard.jsx
import React, { useState } from 'react';
import granja from "../assets/gallinas.jpg";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const RegisterCard = () => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Determinar tipo de usuario según el código ingresado
    const isAdmin = verificationCode === 'ADMIN123'; // ejemplo de código para admin

    try {
      const response = await axios.post(`${API_URL}/api/register/`, {
        email,
        username,
        nombre: name,
        direccion: address,
        telefono: phone,
        password,
        codigo_admin: verificationCode,
      });
      setMessage('Cuenta creada exitosamente');
      navigate('/');
    } catch (error) {
      setMessage('Error al crear la cuenta');
    }
  };

  return (
    <div className="h-3/4 w-full md:w-2/3 bg-white shadow-lg rounded-lg flex md:flex-row flex-col">
      <div className="hidden md:block md:w-1/2 bg-gray-300 rounded-l-lg">
        <img
          src={granja}
          alt="Registro"
          className="w-full h-full object-cover rounded-l-lg"
        />
      </div>

      <div className="md:w-1/2 w-full p-6 flex flex-col justify-center items-center">
        <h2 className="text-2xl font-semibold mb-6">Crear cuenta</h2>

        <form onSubmit={handleSubmit} className="w-full">
          <div className="mb-4">
            <label className="block text-sm font-medium">Nombre completo</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full mt-2 p-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium">Usuario</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full mt-2 p-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium">Correo electrónico</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full mt-2 p-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium">Dirección</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full mt-2 p-2 border border-gray-300 rounded-md"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium">Teléfono</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full mt-2 p-2 border border-gray-300 rounded-md"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium">Código de verificación</label>
            <input
              type="text"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              className="w-full mt-2 p-2 border border-gray-300 rounded-md"
              placeholder="Ingrese el código (si aplica)"
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full mt-2 p-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            Registrarse
          </button>
        </form>

        {message && (
          <div className="mt-4 text-center text-sm text-red-600">
            {message}
          </div>
        )}
      </div>
    </div>
  );
};

export default RegisterCard;
