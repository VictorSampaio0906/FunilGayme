"use client";

import { useState, useEffect, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import GameBoard from "./game-board";
import GameOverPopup from "./game-over-popup";
import BonusAnimation from "./bonus-animation";
import { Button } from "@/components/ui/button";
import {
  Volume2,
  VolumeX,
  Star,
  Coins,
  Trophy,
  Zap,
  Music,
} from "lucide-react";
import { useSoundManager } from "./sound-manager";

const GAME_DURATION = 30; // seconds

export default function CandyCrushGame() {
  const [score, setScore] = useState(0);
  const [bonusTotal, setBonusTotal] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [bonusAnimations, setBonusAnimations] = useState<
    { id: number; amount: number; x: number; y: number }[]
  >([]);
  const [musicLoaded, setMusicLoaded] = useState(false);

  // Initialize sound manager
  const {
    preloadSound,
    playSound,
    playBackgroundMusic,
    stopBackgroundMusic,
    setGlobalVolume,
    isBackgroundMusicPlaying,
  } = useSoundManager({
    enabled: soundEnabled,
  });

  // Preload all sounds when component mounts
  useEffect(() => {
    console.log("Loading sounds...");

    // Preload sound files with the correct paths
    preloadSound("backgroundMusic", "/sounds/background-music.mp3", true); // Background music
    preloadSound("match", "/sounds/match.mp3");
    preloadSound("specialMatch", "/sounds/special-match.mp3");
    preloadSound("gameOver", "/sounds/game-over.mp3");
    preloadSound("win", "/sounds/win.mp3");

    // Mark music as loaded after a short delay
    setTimeout(() => {
      setMusicLoaded(true);
      console.log("All sounds loaded");
    }, 1000);
  }, [preloadSound]);

  // Update volume when sound is toggled
  useEffect(() => {
    setGlobalVolume(soundEnabled ? 1 : 0);
  }, [soundEnabled, setGlobalVolume]);

  // Handle background music during gameplay
  useEffect(() => {
    if (isPlaying && soundEnabled && musicLoaded) {
      console.log("Game started - attempting to play background music");
      // Small delay to ensure the win sound plays first
      setTimeout(() => {
        playBackgroundMusic();
      }, 800);
    } else if (!isPlaying) {
      console.log("Game stopped - stopping background music");
      stopBackgroundMusic();
    }
  }, [
    isPlaying,
    soundEnabled,
    musicLoaded,
    playBackgroundMusic,
    stopBackgroundMusic,
  ]);

  // Start the game with user interaction
  const startGame = useCallback(async () => {
    console.log("Starting game...");

    setIsPlaying(true);
    setScore(0);
    setBonusTotal(0);
    setTimeLeft(GAME_DURATION);
    setGameOver(false);
    setBonusAnimations([]);

    // Play win sound when starting
    await playSound("win");

    // Try to start background music after user interaction
    if (soundEnabled && musicLoaded) {
      console.log("User clicked - trying to start background music");
      setTimeout(async () => {
        await playBackgroundMusic();
      }, 500);
    }
  }, [playSound, playBackgroundMusic, soundEnabled, musicLoaded]);

  // Handle match in the game
  const handleMatch = (matchSize: number, x: number, y: number) => {
    if (!isPlaying) return; // Don't process matches if game is not playing

    const points = matchSize * 10;
    const bonusAmount = matchSize * 10;

    setScore((prev) => prev + points);
    setBonusTotal((prev) => prev + bonusAmount);

    // Add bonus animation
    const newAnimation = {
      id: Date.now() + Math.random(), // isso GERA um número único e não dá erro
      amount: bonusAmount,
      x,
      y,
    };

    setBonusAnimations((prev) => [...prev, newAnimation]);

    // Remove animation after it completes
    setTimeout(() => {
      setBonusAnimations((prev) =>
        prev.filter((anim) => anim.id !== newAnimation.id)
      );
    }, 1500);

    // Play appropriate sound based on match size
    if (matchSize >= 4) {
      playSound("specialMatch"); // Special match for 4+ pieces
    } else {
      playSound("match"); // Normal match for 3 pieces
    }
  };

  // Handle successful swap
  const handleSuccessfulSwap = () => {
    // Don't play additional sound for successful swap, the match sound will play
  };

  // Handle invalid move
  const handleInvalidMove = () => {
    // Could add a specific sound for invalid moves if needed
  };

  // Toggle sound with user interaction
  const toggleSound = useCallback(async () => {
    const newSoundState = !soundEnabled;
    setSoundEnabled(newSoundState);

    // If enabling sound and game is playing, try to start background music
    if (newSoundState && isPlaying && musicLoaded) {
      console.log("Sound enabled during game - starting background music");
      setTimeout(async () => {
        await playBackgroundMusic();
      }, 100);
    }
  }, [soundEnabled, isPlaying, musicLoaded, playBackgroundMusic]);

  // Game timer
  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (isPlaying && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (isPlaying && timeLeft === 0) {
      setIsPlaying(false);
      setGameOver(true);
      stopBackgroundMusic();
      playSound("gameOver");
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isPlaying, timeLeft, playSound, stopBackgroundMusic]);

  // Stop background music when component unmounts
  useEffect(() => {
    return () => {
      stopBackgroundMusic();
    };
  }, [stopBackgroundMusic]);

  return (
    <div className="bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 rounded-lg sm:rounded-xl shadow-2xl p-3 sm:p-6 w-full relative overflow-hidden min-h-0">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-4 -left-4 w-16 h-16 sm:w-24 sm:h-24 bg-white/10 rounded-full blur-xl"></div>
        <div className="absolute top-1/4 -right-6 w-20 h-20 sm:w-32 sm:h-32 bg-yellow-300/20 rounded-full blur-2xl"></div>
        <div className="absolute -bottom-6 left-1/3 w-18 h-18 sm:w-28 sm:h-28 bg-pink-300/15 rounded-full blur-xl"></div>
      </div>

      {/* Sound Toggle Button - Always visible */}
      <motion.button
        onClick={toggleSound}
        className={`absolute top-2 right-2 sm:top-4 sm:right-4 z-10 w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 ${
          soundEnabled
            ? "bg-white/20 backdrop-blur-sm text-white hover:bg-white/30"
            : "bg-black/20 backdrop-blur-sm text-white/60 hover:bg-black/30"
        }`}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
      >
        <motion.div
          key={soundEnabled ? "on" : "off"}
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          {soundEnabled ? (
            <Volume2 size={18} className="sm:w-5 sm:h-5" />
          ) : (
            <VolumeX size={18} className="sm:w-5 sm:h-5" />
          )}
        </motion.div>
      </motion.button>

      {/* Music indicator when playing */}
      {isPlaying && soundEnabled && (
        <motion.div
          className="absolute top-2 right-14 sm:top-4 sm:right-20 z-10 flex items-center gap-1 sm:gap-2 bg-white/20 backdrop-blur-sm rounded-full px-2 py-1 sm:px-3 sm:py-2"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1 }}
        >
          <Music size={12} className="text-white sm:w-4 sm:h-4" />
          <div className="flex gap-0.5 sm:gap-1">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-0.5 sm:w-1 bg-white rounded-full"
                animate={{
                  height: [3, 8, 3],
                }}
                transition={{
                  duration: 0.8,
                  repeat: Number.POSITIVE_INFINITY,
                  delay: i * 0.2,
                }}
              />
            ))}
          </div>
        </motion.div>
      )}

      {!isPlaying && !gameOver ? (
        <motion.div
          className="flex flex-col items-center justify-center py-4 sm:py-8 relative z-10 min-h-0"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Logo/Title Section - Compacto */}
          <motion.div
            className="text-center mb-4 sm:mb-6"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white mb-1 sm:mb-2 drop-shadow-lg">
              CANDY
              <span className="text-yellow-300"> BONUS 🎁</span>
            </h1>
            <div className="flex items-center justify-center gap-1 sm:gap-2 mb-2 sm:mb-4">
              <Star className="text-yellow-300" size={16} />
              <p className="text-white/90 text-sm sm:text-lg lg:text-xl font-bold">
                <span className="text-yellow-400">Jogue</span> e libere acesso a
                um
                <span className="text-black"> método oculto</span> de
                <span className="text-green-400"> faturar com doces </span> —
                apenas com o seu
                <span className="text-blue-400"> celular!</span>
              </p>

              <Star className="text-yellow-300" size={16} />
            </div>
          </motion.div>

          {/* Features Cards - Mais compacto */}
          <motion.div
            className="grid grid-cols-3 gap-2 sm:gap-4 mb-4 sm:mb-6 w-full max-w-sm sm:max-w-2xl"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-2 sm:p-4 text-center">
              <Coins
                className="text-yellow-300 mx-auto mb-1 sm:mb-2"
                size={20}
              />
              <h3 className="text-white font-bold text-xs sm:text-sm">
                Presente Surpresa 🎁
              </h3>
              <p className="text-white/80 text-xs hidden sm:block">
                Só Leva 1 Minuto ⏱️
              </p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-2 sm:p-4 text-center">
              <Zap className="text-orange-300 mx-auto mb-1 sm:mb-2" size={20} />
              <h3 className="text-white font-bold text-xs sm:text-sm">
                Método Real 💡
              </h3>
              <p className="text-white/80 text-xs hidden sm:block">
                Descubra em 60s seu potencial de lucro
              </p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-2 sm:p-4 text-center">
              <Trophy
                className="text-pink-300 mx-auto mb-1 sm:mb-2"
                size={20}
              />
              <h3 className="text-white font-bold text-xs sm:text-sm">
                Só Leva 1 Minuto ⏱️
              </h3>
              <p className="text-white/80 text-xs hidden sm:block">
                Receba o passo a passo para lucrar com doces
              </p>
            </div>
          </motion.div>

          {/* Instructions - Mais compacto */}
          <motion.div
            className="bg-white/15 backdrop-blur-sm rounded-xl p-3 sm:p-6 mb-4 sm:mb-6 w-full max-w-xs sm:max-w-md"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            <h3 className="text-white font-bold text-sm sm:text-lg mb-2 sm:mb-3 text-center">
              Como Jogar:
            </h3>
            <div className="space-y-1 sm:space-y-2 text-white/90">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-5 h-5 sm:w-6 sm:h-6 bg-yellow-400 rounded-full flex items-center justify-center text-black font-bold text-xs sm:text-sm">
                  1
                </div>
                <p className="text-xs sm:text-sm">
                  Arraste os doces para combiná-los
                </p>
              </div>
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-5 h-5 sm:w-6 sm:h-6 bg-yellow-400 rounded-full flex items-center justify-center text-black font-bold text-xs sm:text-sm">
                  2
                </div>
                <p className="text-xs sm:text-sm">Alcance a pontuação</p>
              </div>
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-5 h-5 sm:w-6 sm:h-6 bg-yellow-400 rounded-full flex items-center justify-center text-black font-bold text-xs sm:text-sm">
                  3
                </div>
                <p className="text-xs sm:text-sm">
                  Desbloqueie seu presente especial
                </p>
              </div>
            </div>
          </motion.div>

          {/* CTA Button - Responsivo */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="w-full max-w-xs sm:max-w-sm"
          >
            <Button
              onClick={startGame}
              className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black font-black py-4 sm:py-6 px-6 sm:px-12 rounded-full text-lg sm:text-2xl shadow-2xl transform transition hover:scale-105 border-2 sm:border-4 border-white/30"
            >
              QUERO DESCOBRIR O SEGREDO!
            </Button>
            <p className="text-white/80 text-center mt-2 sm:mt-3 text-xs sm:text-sm">
              ⚡ Acesso exclusivo • 💰 Aprenda Ganhar dinheiro!
            </p>
          </motion.div>
        </motion.div>
      ) : isPlaying ? (
        <div className="flex flex-col items-center pt-8 sm:pt-16 relative z-10 min-h-0">
          <div className="w-full flex justify-between items-center mb-3 sm:mb-6">
            <div className="bg-gradient-to-r from-green-400 to-green-600 text-white px-3 py-2 sm:px-5 sm:py-3 rounded-lg font-bold text-sm sm:text-lg shadow-md">
              {bonusTotal.toFixed(2)}
            </div>
            <div
              className={`px-3 py-2 sm:px-5 sm:py-3 rounded-lg font-bold text-sm sm:text-lg shadow-md ${
                timeLeft <= 10
                  ? "bg-gradient-to-r from-red-500 to-red-600 text-white animate-pulse"
                  : "bg-gradient-to-r from-red-400 to-red-600 text-white"
              }`}
            >
              {timeLeft}s
            </div>
          </div>

          <GameBoard
            onMatch={handleMatch}
            onSuccessfulSwap={handleSuccessfulSwap}
            onInvalidMove={handleInvalidMove}
          />

          {/* Bonus animations */}
          <AnimatePresence>
            {bonusAnimations.map((anim) => (
              <BonusAnimation
                key={anim.id}
                amount={anim.amount}
                x={anim.x}
                y={anim.y}
              />
            ))}
          </AnimatePresence>
        </div>
      ) : null}

      {/* Game over popup */}
      {gameOver && (
        <GameOverPopup bonusTotal={bonusTotal} onRestart={startGame} />
      )}
    </div>
  );
}
