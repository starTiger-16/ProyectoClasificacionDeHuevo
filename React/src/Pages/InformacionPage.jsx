// src/Pages/ProductosPage.jsx
import React from "react";
import NavBar from "../Components/Navbar";

export function InformacionPage() {
  return (
    <div className="bg-white flex flex-col min-h-screen">
      <NavBar />

      {/* Contenido principal */}
      <div className="flex-grow p-6 max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-4 text-yellow-700">Sobre Nosotros</h1>
        <p className="mb-4 text-lg text-gray-700">
          Bienvenido a <span className="font-semibold text-yellow-800">Huevos del Valle</span>, la plataforma en línea donde las granjas de Cochabamba y Bolivia
          pueden ofrecer sus huevos frescos directamente al consumidor. Conectamos al campo con la ciudad, promoviendo el comercio justo,
          el producto local y la alimentación saludable.
        </p>
        <p className="mb-4 text-gray-600">
          Aquí encontrarás huevos frescos, de gallinas criadas con amor y cuidados tradicionales. ¡Cada compra apoya directamente a
          pequeños productores y a sus familias!
        </p>
        <p className="text-gray-600">
          ¿Eres productor? Únete a nuestra red y empieza a vender tus productos de forma sencilla y rápida.
        </p>
      </div>

      {/* Footer */}
      <footer className="bg-yellow-100 mt-8 py-6">
        <div className="max-w-4xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center text-gray-700">
          {/* Contacto */}
          <div className="mb-4 md:mb-0 text-center md:text-left">
            <h3 className="text-lg font-semibold mb-1">Contacto</h3>
            <p>Email: <a href="mailto:huevosdelvalle@gmail.com" className="underline">huevosdelvalle@gmail.com</a></p>
            <p>Teléfono: <a href="tel:+59171234567" className="underline">+591 71234567</a></p>
            <p>Ubicación: Santa Barbara, Zona Sur, Cochabamba</p>
          </div>

          {/* Redes sociales */}
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-1">Síguenos</h3>
            <div className="flex gap-4 justify-center">
              <a href="https://facebook.com/huevosdelvalle" target="_blank" rel="noopener noreferrer" className="hover:underline">
                Facebook
              </a>
              <a href="https://instagram.com/huevosdelvalle" target="_blank" rel="noopener noreferrer" className="hover:underline">
                Instagram
              </a>
              <a href="https://wa.me/59171234567" target="_blank" rel="noopener noreferrer" className="hover:underline">
                WhatsApp
              </a>
            </div>
          </div>
        </div>

        <div className="text-center mt-4 text-sm text-gray-500">
          © {new Date().getFullYear()} Huevos del Valle. Todos los derechos reservados.
        </div>
      </footer>
    </div>
  );
}
