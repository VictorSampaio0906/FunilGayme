import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeWrapper } from "./theme-wrapper";
import { MetaPixel } from "./_meta-pixel"; // 👈 Importa aqui
import UTMify from "@/components/UTMify";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Candy Bonus - Jogue e Ganhe",
  description:
    "Jogue e ganhe bônus em reais com nosso jogo estilo Candy Crush!",
  generator: "Eu o 00",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body suppressHydrationWarning className={inter.className}>
        <MetaPixel />
        <UTMify /> {/* 👈 Ativando a captura de UTMs com a UTMify */}
        <ThemeWrapper>{children}</ThemeWrapper>
      </body>
    </html>
  );
}
