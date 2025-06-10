"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

export default function DelayedCheckoutButton({
  handleCheckout,
}: {
  handleCheckout: () => void;
}) {
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowButton(true);
    }, 10000); // 40 segundos

    return () => clearTimeout(timer);
  }, []);

  return showButton ? (
    <Button
      onClick={handleCheckout}
      className="w-full py-4 sm:py-6 text-base sm:text-lg font-semibold bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-xl shadow-xl transform transition hover:scale-105 flex items-center justify-center gap-2"
    >
      <span className="text-red-500 line-through text-sm sm:text-base">
        R$97,90
      </span>
      <span className="text-white font-bold text-lg sm:text-xl">
        AGORA por R$19,90
      </span>
    </Button>
  ) : null;
}
