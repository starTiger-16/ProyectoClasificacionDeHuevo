import React from 'react';
import egg from '../assets/egg.jpg';

const Card = ({ titulo, imagenSize, cantidad }) => {
  // Determinar el tamaño de la imagen con el prop `imagenSize`
  const imageSizeClass = imagenSize === "sm" ? "h-32" : imagenSize === "md" ? "h-37" : imagenSize === "lg" ? "h-42" : "h-48";

  return (
    <div className="w-64 h-[350px] mx-auto bg-white rounded-lg shadow-lg overflow-hidden flex flex-col">
      {/* Titulo encima de la imagen */}
      <div className="p-4 text-center text-xl font-bold flex-shrink-0">
        {titulo}
      </div>

      {/* Imagen con tamaño variable */}
      <div className="w-full h-full flex justify-center items-center overflow-hidden">
        <img
          className={`object-contain ${imageSizeClass}`}
          src={egg}
          alt="Imagen"
        />
      </div>

      {/* Recuadro del contador abajo */}
      <div className="p-4 bg-[#16a085] text-white text-3xl font-bold text-center mt-auto">
        <div>{cantidad}</div>
      </div>
    </div>
  );
};

export default Card;
