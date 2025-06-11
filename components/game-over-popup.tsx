"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Play, Pause } from "lucide-react";
import { useSoundManager } from "./sound-manager";
import VideoSection from "./ui/video-section";
import DelayedCheckoutButton from "@/components/DelayedCheckoutButton";
import AoVivo from "./AoVivo";
import Cronometro from "./Cronometro";
import NotificacaoCompra from "./notificacao-compra";

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
        {/* Notificações de compra - apenas no popup final */}
        <NotificacaoCompra soundEnabled={soundEnabled} />
        {/* Content section */}
        <div className="p-4 sm:p-8">
          <div className="mb-4 sm:mb-6 text-center">
            <motion.h2
              className="text-center text-[26px] sm:text-[30px] font-extrabold leading-tight text-black px-4 mb-4"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.6, type: "spring" }}
            >
              Assista o vídeo e veja como fazer{" "}
              <span className="text-green-600">
                R${formattedBonus.toFixed(2)}
              </span>{" "}
              em poucos dias com DOCE!
            </motion.h2>

            <Cronometro />
            <motion.div
              className="bg-gradient-to-br from-neutral-950 via-neutral-900 to-zinc-900 text-white text-center px-6 py-5 rounded-2xl shadow-[0_8px_28px_rgba(0,0,0,0.35)] ring-1 ring-white/10 backdrop-blur-sm max-w-md mx-auto mt-7 mb-7"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <p className="text-[17px] sm:text-[19px] font-medium leading-relaxed tracking-tight drop-shadow-sm">
                Enquanto{" "}
                <span className="font-semibold text-rose-400">
                  você só arrasta doce
                </span>
                , tem gente
                <span className="font-semibold text-emerald-400">
                  {" "}
                  lucrando de casa
                </span>{" "}
                com um método tão ridículo que parece piada —
                <span className="font-semibold text-white">
                  {" "}
                  mas paga de verdade!
                </span>
              </p>
            </motion.div>
          </div>
          <div className="text-[20px] sm:text-[22px] font-extrabold text-white text-center px-4 py-2 mb-3 rounded-xl bg-gradient-to-r from-red-600 via-red-700 to-red-800 shadow-md drop-shadow-[0_2px_6px_rgba(0,0,0,0.3)]">
            Não é sorte. Não é golpe!
          </div>

          <div className="text-center my-6 px-4 sm:px-6">
            <p className="text-xl sm:text-2xl font-extrabold leading-snug text-neutral-800">
              É um método tão{" "}
              <span className="inline-block bg-red-600 text-white px-2.5 py-0.5 rounded-md shadow-sm">
                idiota
              </span>{" "}
              que dá{" "}
              <span className="inline-block bg-red-600 text-white px-2.5 py-0.5 rounded-md shadow-sm">
                raiva
              </span>{" "}
              de não ter visto antes.
            </p>
          </div>

          <motion.div
            className="flex items-start gap-4 p-4 sm:p-5 bg-white border border-gray-200 rounded-xl shadow-lg sm:mb-8 mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.5, ease: "easeOut" }}
          >
            {/* Avatar fake */}
            <div className="flex-shrink-0">
              <img
                src="https://randomuser.me/api/portraits/women/65.jpg"
                alt="Usuária"
                className="w-12 h-12 rounded-full border-2 border-green-500 shadow-sm"
              />
            </div>

            {/* Conteúdo do depoimento */}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <p className="font-semibold text-gray-800">Juliana M.</p>
                <span className="text-green-600 text-xs font-medium bg-green-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-3 h-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  verificado
                </span>
              </div>
              <p className="text-sm text-gray-700 leading-snug">
                “Acabei de fazer{" "}
                <span className="text-green-600 font-bold">R$1.270</span> em 4
                dias com esse método de DOCE. Achei que era fake, mas FUNCIONA
                MESMO!”
              </p>
              <p className="text-xs text-gray-400 mt-1">há 3 minutos</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1 }}
          >
            <DelayedCheckoutButton handleCheckout={handleCheckout} />
          </motion.div>
          <div className="bg-white rounded-2xl p-4 shadow-md border border-gray-200 max-w-md mx-auto text-left mt-6 space-y-4">
            <h3 className="text-2xl font-semibold text-center text-gray-800">
              O que você vai receber imediatamente:
            </h3>

            <ul className="space-y-3 text-base text-gray-700">
              <li className="flex items-start gap-3">
                <span className="text-green-600 text-xl">📕</span>
                <span>
                  <strong>Apostila Digital:</strong> Descubra o passo a passo
                  para lucrar com doces direto do seu celular, sem sair de casa.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-600 text-xl">📈</span>
                <span>
                  <strong>Aulas Exclusivas:</strong> Comece ainda hoje, mesmo
                  sem experiência em vendas — e o melhor: sem precisar sair de
                  casa! Método simples, direto e completo.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-yellow-500 text-xl">📋</span>
                <span>
                  <strong>Plano de Ação Rápida:</strong> Comece hoje e veja seus
                  primeiros lucros em menos de 24 horas — tudo pronto, testado e
                  feito pra quem quer resultado rápido.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-pink-500 text-xl">💬</span>
                <span>
                  <strong>Suporte Premium:</strong> Tire suas dúvidas
                  diretamente com nossa equipe. Acompanhamento garantido.
                </span>
              </li>
            </ul>

            <div className="text-center pt-2">
              <div className="inline-block px-4 py-2 text-sm bg-green-100 text-green-700 rounded-full font-semibold">
                <span className="line-through text-red-500 mr-2">R$97,90</span>
                <span className="text-green-700 font-bold">
                  AGORA por R$19,90
                </span>
              </div>
              <p className="mt-1 text-xs text-gray-500 italic">
                *Oferta especial disponível por tempo limitado.
              </p>
            </div>
          </div>

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
