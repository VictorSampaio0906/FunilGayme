import CandyCrushGame from "@/components/candy-crush-game";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex flex-col items-center justify-center p-2 sm:p-4 overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 25% 25%, #fbbf24 0%, transparent 50%), 
                           radial-gradient(circle at 75% 75%, #ec4899 0%, transparent 50%),
                           radial-gradient(circle at 50% 50%, #8b5cf6 0%, transparent 50%)`,
          }}
        ></div>
      </div>

      <div className="w-full max-w-sm sm:max-w-md relative z-10 h-screen flex flex-col">
        {/* Header - Compacto */}
        <div className="text-center mb-2 sm:mb-4 mt-3 pt-2">
          <h1 className="text-lg sm:text-xl font-black text-white drop-shadow-lg mb-3">
            🍭 DESAFIO DOS DOCES 🍬
          </h1>{" "}
          <p className="text-white/80 font-semibold text-base sm:text-base px-4 mt-2">
            🎯 Você está prestes a{" "}
            <span className="text-green-500 font-black"> JOGAR </span> e, se
            bater a meta de pontos{" "}
            <span className="text-green-500 font-black"> DESBLOQUEIA 🎁</span>{" "}
            um super desconto em um{" "}
            <span className="text-green-500 font-black">método</span>que pode
            transformar sua renda!
          </p>
        </div>
        {/* Game Container - Flex grow para ocupar espaço disponível */}
        <div className="flex-1 flex flex-col justify-center">
          <CandyCrushGame />
        </div>
        {/* Footer - Compacto */}
        <div className="text-center mt-2 pb-2 text-white/60 text-xs">
          <p>
            🚨 Acesso liberado só para quem jogar agora!🚨 Mais de 10.000
            jogadores já ganharam!
          </p>
        </div>
      </div>
    </main>
  );
}
