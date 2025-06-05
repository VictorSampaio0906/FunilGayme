"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Users } from "lucide-react";

export default function AoVivo() {
  const [viewerCount, setViewerCount] = useState(876);

  // Animar o contador de pessoas ao vivo
  useEffect(() => {
    const interval = setInterval(() => {
      // Oscila entre 876 e 930
      const min = 876;
      const max = 930;
      const newCount = Math.floor(Math.random() * (max - min + 1)) + min;
      setViewerCount(newCount);
    }, 4000); // Muda a cada 2 segundos

    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      className="absolute top-3 right-3 bg-red-600 text-white px-2 py-1 rounded-lg shadow-lg flex items-center gap-1.5 text-xs font-bold"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 1, duration: 0.5 }}
    >
      {/* Ícone de pessoas */}
      <Users size={12} className="text-white" />

      {/* Contador animado */}
      <motion.span
        key={viewerCount}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="min-w-[2rem] text-center"
      >
        {viewerCount.toLocaleString()}
      </motion.span>

      {/* Indicador de "ao vivo" */}
      <div className="flex items-center gap-1">
        <motion.div
          className="w-1.5 h-1.5 bg-white rounded-full"
          animate={{
            opacity: [1, 0.3, 1],
            scale: [1, 0.8, 1],
          }}
          transition={{
            duration: 1.5,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
        <span className="text-xs font-bold">AO VIVO</span>
      </div>
    </motion.div>
  );
}
