"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, User } from "lucide-react";

interface NotificacaoCompraProps {
  soundEnabled?: boolean;
}

export default function NotificacaoCompra({
  soundEnabled = true,
}: NotificacaoCompraProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [currentMessage, setCurrentMessage] = useState("");

  // Mensagens aleatórias de gatilho de compra
  const messages = [
    "Vanessa acabou de adquirir o método secreto!",
    "Carlos ganhou R$450 em apenas 2 horas!",
    "Maria Julia comprou agora mesmo!",
    "Pedro faturou R$320 hoje usando o método!",
    "Ana Beatriz acabou de garantir sua vaga!",
    "João Paulo está ganhando R$200/dia!",
    "Fernanda comprou há 3 minutos!",
    "Ricardo já fez R$680 esta semana!",
    "Camila acabou de adquirir o curso!",
    "Bruno está lucrando R$150/dia!",
    "Juliana comprou e já está ganhando!",
    "Marcos fez R$890 no primeiro mês!",
    "Letícia acabou de garantir o desconto!",
    "Rafael está com resultados incríveis!",
    "Patrícia comprou há poucos minutos!",
  ];

  // Som de notificação
  const playNotificationSound = () => {
    if (!soundEnabled) return;

    try {
      // Criar um som de notificação suave usando Web Audio API
      const audioContext = new (window.AudioContext ||
        (window as any).webkitAudioContext)();

      // Frequências para um som agradável (acorde maior)
      const frequencies = [523.25, 659.25, 783.99]; // C5, E5, G5

      frequencies.forEach((freq, index) => {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.setValueAtTime(freq, audioContext.currentTime);
        oscillator.type = "sine";

        // Volume baixo e fade out
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(
          0.01,
          audioContext.currentTime + 0.5
        );

        // Delay entre as notas para criar harmonia
        oscillator.start(audioContext.currentTime + index * 0.1);
        oscillator.stop(audioContext.currentTime + 0.5 + index * 0.1);
      });
    } catch (error) {
      console.warn("Não foi possível reproduzir o som de notificação:", error);
    }
  };

  // Mostrar notificação
  const showNotification = () => {
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    setCurrentMessage(randomMessage);
    setIsVisible(true);

    // Tocar som
    playNotificationSound();

    // Esconder após 6 segundos
    setTimeout(() => {
      setIsVisible(false);
    }, 6000);
  };

  // Configurar intervalo de 15 segundos - apenas quando o componente é montado (no popup final)
  useEffect(() => {
    // Primeira notificação após 3 segundos (para dar tempo do popup aparecer)
    const initialTimeout = setTimeout(() => {
      showNotification();
    }, 3000);

    // Depois a cada 15 segundos
    const interval = setInterval(() => {
      showNotification();
    }, 15000);

    return () => {
      clearTimeout(initialTimeout);
      clearInterval(interval);
    };
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className=" fixed top-4 inset-x-0 z-[9999] px-4 flex justify-center "
          initial={{ opacity: 0, y: -100, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -50, scale: 0.9 }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 25,
            duration: 0.6,
          }}
        >
          <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200/50 p-4 flex items-center gap-3 relative overflow-hidden">
            {/* Brilho sutil de fundo */}
            <div className="absolute inset-0 bg-gradient-to-r from-green-50/50 to-emerald-50/50 rounded-2xl" />

            {/* Ícone de check verde */}
            <div className="relative z-10 flex-shrink-0">
              <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                <CheckCircle size={20} className="text-white" />
              </div>
            </div>

            {/* Conteúdo da mensagem */}
            <div className="relative z-10 flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <User size={14} className="text-gray-600 flex-shrink-0" />
                <p className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                  Nova Compra
                </p>
              </div>

              <motion.p
                className="text-sm font-semibold text-gray-900 leading-tight"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                {currentMessage}
              </motion.p>

              <p className="text-xs text-gray-500 mt-1">Agora mesmo</p>
            </div>

            {/* Indicador de tempo */}
            <div className="relative z-10 flex-shrink-0">
              <motion.div
                className="w-1 h-8 bg-green-500 rounded-full"
                initial={{ height: 32 }}
                animate={{ height: 0 }}
                transition={{ duration: 6, ease: "linear" }}
              />
            </div>

            {/* Efeito de pulso */}
            <motion.div
              className="absolute inset-0 bg-green-500/10 rounded-2xl"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: [0, 0.3, 0], scale: [0.8, 1.1, 1] }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </div>

          {/* Sombra adicional para profundidade */}
          <div className="absolute inset-0 bg-black/5 rounded-2xl blur-xl transform translate-y-2 -z-10" />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
