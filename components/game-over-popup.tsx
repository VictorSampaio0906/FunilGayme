"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Play, Pause } from "lucide-react";
import { useSoundManager } from "./sound-manager";
import VideoSection from "./ui/video-section";
import DelayedCheckoutButton from "@/components/DelayedCheckoutButton";
import AoVivo from "./AoVivo";

interface GameOverPopupProps {
  bonusTotal: number;
  onRestart: () => void;
}

export default function GameOverPopup({
  bonusTotal,
  onRestart,
}: GameOverPopupProps) {
  const [isPlaying, setIsPlaying] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [formattedBonus, setFormattedBonus] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Sound manager for popup sounds
  const { preloadSound, playSound } = useSoundManager({
    enabled: soundEnabled,
  });

  // Preload popup-specific sounds
  useEffect(() => {
    // Use the win sound for celebration in popup
    preloadSound("win", "/sounds/win.mp3");

    // Play celebration sound when popup appears
    setTimeout(() => {
      playSound("win");
    }, 500);
  }, [preloadSound, playSound]);

  // Calculate the formatted bonus only once when the component mounts
  useEffect(() => {
    // Format the bonus total to look more impressive
    const calculatedBonus =
      Math.floor(bonusTotal * 1.5) + Math.floor(Math.random() * 200);
    setFormattedBonus(calculatedBonus);
  }, [bonusTotal]);

  // Toggle video play/pause (simulated)
  const toggleVideo = () => {
    setIsPlaying(!isPlaying);
  };

  // Handle checkout button click
  const handleCheckout = () => {
    // This would redirect to an external checkout
    window.location.href = "https://www.v-pay.tech";
  };

  // Handle restart button click
  const handleRestart = () => {
    onRestart();
  };

  return (
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-3 sm:p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        className="bg-white rounded-xl shadow-2xl w-full max-w-sm sm:max-w-md overflow-hidden relative max-h-[90vh] overflow-y-auto"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 25, delay: 0.2 }}
      >
        <VideoSection />

        {/* Componente de pessoas ao vivo */}
        <AoVivo />

        {/* Content section */}
        <div className="p-4 sm:p-8">
          <div className="mb-4 sm:mb-6 text-center">
            <motion.h2
              className="text-2xl sm:text-3xl font-extrabold text-green-500 mb-2 sm:mb-3"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5, type: "spring" }}
            >
              Assista o video para começar a lucrar!
            </motion.h2>
            <motion.p
              className="text-lg sm:text-xl font-bold text-gray-700"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              Assista o video para entender como voce pode fazer dinheiro apenas
              com seu celular com um método tão simples quanto arrastar doce!
            </motion.p>
          </div>

          <motion.div
            className="bg-yellow-50 border-l-4 border-yellow-400 p-3 sm:p-5 mb-4 sm:mb-8 rounded-r-lg"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.9 }}
          >
            <p className="text-lg sm:text-xl font-bold  text-gray-800">
              Enquanto você reclama, outros estão lucrando{" "}
              <span className="text-green-500 font-extrabold">
                R${formattedBonus.toFixed(2)}
              </span>{" "}
              por dia! Chega de desculpas! Assista o video para liberar o acesso
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1 }}
          >
            <DelayedCheckoutButton handleCheckout={handleCheckout} />
          </motion.div>

          <motion.p
            className="text-center text-xs sm:text-sm mt-3 sm:mt-4 text-gray-600 font-medium"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.3 }}
          >
            Você ainda vai receber 3 bônus exclusivos no pós-compra!
          </motion.p>

          <motion.div
            className="mt-4 sm:mt-8 flex justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
          ></motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
}
