"use client"

import { motion } from "framer-motion"

interface BonusAnimationProps {
  amount: number
  x: number
  y: number
}

export default function BonusAnimation({ amount, x, y }: BonusAnimationProps) {
  // Convert board coordinates to approximate pixel positions
  // Each candy is about 56px (14 * 4) and there's a 6px gap
  const posX = x * 62 + 31
  const posY = y * 62 + 31

  return (
    <motion.div
      className="absolute pointer-events-none z-10 font-bold text-2xl"
      initial={{
        x: posX,
        y: posY,
        scale: 0.5,
        opacity: 0,
      }}
      animate={{
        y: posY - 60,
        scale: 1.2,
        opacity: 1,
      }}
      exit={{
        y: posY - 100,
        opacity: 0,
      }}
      transition={{
        duration: 1.5,
        ease: "easeOut",
      }}
    >
      <span className="text-green-500 drop-shadow-lg">+R${amount}</span>
    </motion.div>
  )
}
