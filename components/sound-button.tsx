"use client"

import { motion } from "framer-motion"
import { Volume2, VolumeX } from "lucide-react"

interface SoundButtonProps {
  soundEnabled: boolean
  onToggle: () => void
  size?: "sm" | "md" | "lg"
  className?: string
}

export default function SoundButton({ soundEnabled, onToggle, size = "md", className = "" }: SoundButtonProps) {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16",
  }

  const iconSizes = {
    sm: 16,
    md: 20,
    lg: 24,
  }

  return (
    <motion.button
      onClick={onToggle}
      className={`
        ${sizeClasses[size]} 
        rounded-full flex items-center justify-center shadow-lg transition-all duration-300 
        ${
          soundEnabled
            ? "bg-gradient-to-r from-green-400 to-green-500 text-white hover:from-green-500 hover:to-green-600 hover:shadow-green-200"
            : "bg-gradient-to-r from-gray-400 to-gray-500 text-white hover:from-gray-500 hover:to-gray-600 hover:shadow-gray-200"
        }
        hover:shadow-xl
        ${className}
      `}
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
        className="flex items-center justify-center"
      >
        {soundEnabled ? <Volume2 size={iconSizes[size]} /> : <VolumeX size={iconSizes[size]} />}
      </motion.div>

      {/* Pulse effect when sound is on */}
      {soundEnabled && (
        <motion.div
          className="absolute inset-0 rounded-full bg-green-400 opacity-30"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.1, 0.3],
          }}
          transition={{
            duration: 2,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
      )}

      {/* Sound waves animation when enabled */}
      {soundEnabled && (
        <>
          <motion.div
            className="absolute -right-1 top-1/2 transform -translate-y-1/2 w-1 h-1 bg-white rounded-full"
            animate={{
              scale: [0, 1, 0],
              x: [0, 8, 16],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 1.5,
              repeat: Number.POSITIVE_INFINITY,
              delay: 0,
            }}
          />
          <motion.div
            className="absolute -right-1 top-1/2 transform -translate-y-1/2 w-1 h-1 bg-white rounded-full"
            animate={{
              scale: [0, 1, 0],
              x: [0, 12, 24],
              opacity: [0, 0.8, 0],
            }}
            transition={{
              duration: 1.5,
              repeat: Number.POSITIVE_INFINITY,
              delay: 0.3,
            }}
          />
          <motion.div
            className="absolute -right-1 top-1/2 transform -translate-y-1/2 w-1 h-1 bg-white rounded-full"
            animate={{
              scale: [0, 1, 0],
              x: [0, 16, 32],
              opacity: [0, 0.6, 0],
            }}
            transition={{
              duration: 1.5,
              repeat: Number.POSITIVE_INFINITY,
              delay: 0.6,
            }}
          />
        </>
      )}
    </motion.button>
  )
}
