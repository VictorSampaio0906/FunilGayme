"use client";
import { useEffect, useState } from "react";

export default function AvisoUrgente() {
  const [tempoRestante, setTempoRestante] = useState(600); // 5 minutos

  useEffect(() => {
    const intervalo = setInterval(() => {
      setTempoRestante((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(intervalo);
  }, []);

  const formatarTempo = (segundos: number) => {
    const min = Math.floor(segundos / 60)
      .toString()
      .padStart(2, "0");
    const sec = (segundos % 60).toString().padStart(2, "0");
    return `${min}:${sec}`;
  };

  return (
    <div className="flex flex-col items-center justify-center px-4">
      <div className="bg-gradient-to-br from-red-600 via-red-500 to-rose-600 text-white rounded-2xl shadow-md px-6 py-4 w-full max-w-sm text-center relative overflow-hidden">
        {/* Efeito de brilho sutil */}
        <div className="absolute inset-0 bg-white/5 backdrop-blur-sm rounded-2xl pointer-events-none" />

        {/* Título */}
        <p className="text-sm sm:text-base font-semibold uppercase tracking-wide text-white/90 z-10 relative drop-shadow-sm">
          Oferta por tempo limitado
        </p>

        {/* Timer */}
        <div className="text-[2.2rem] sm:text-[2.5rem] font-extrabold mt-1 text-white z-10 relative tracking-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]">
          {formatarTempo(tempoRestante)}
        </div>
      </div>
    </div>
  );
}
