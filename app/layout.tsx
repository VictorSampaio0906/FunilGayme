import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeWrapper } from "./theme-wrapper";

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
      {/* Removemos style ou className direto do <html> */}
      <body suppressHydrationWarning className={inter.className}>
        <ThemeWrapper>{children}</ThemeWrapper>
      </body>
    </html>
  );
}
