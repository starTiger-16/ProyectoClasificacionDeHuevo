import { useEffect, useState } from "react";
import axios from "axios";

const Gauge = ({ valor = 0, maximo = 11 }) => {
  const porcentaje = Math.min((valor / maximo) * 100, 100);
  const dashoffset = 125 - (porcentaje / 100) * 125;

  return (
    <div className="my-5 w-full bg-white p-6 rounded-lg shadow-md flex flex-col items-center space-y-4">
      <div className="relative w-48 h-48">
        <h1 className="text-center text-xl font-bold">Huevos por minuto</h1>
        <svg className="absolute top-0 left-0 w-full h-full" viewBox="0 0 100 50">
          <path d="M 10 50 A 40 40 0 0 1 90 50" fill="none" stroke="#ddd" strokeWidth="10" />
          <path
            d="M 10 50 A 40 40 0 0 1 90 50"
            fill="none"
            stroke="#16a085"
            strokeWidth="10"
            strokeDasharray="125"
            strokeDashoffset={dashoffset}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col justify-end items-center text-3xl font-bold text-gray-700">
          {valor}
        </div>
      </div>
    </div>
  );
};

export default Gauge;
