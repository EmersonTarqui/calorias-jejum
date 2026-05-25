import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Meu App de Calorias",
  description: "Gerenciamento diário de calorias",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      {/* h-screen e flex-col para travar o espaço e dividir entre conteúdo e footer */}
      <body className="h-screen flex flex-col bg-white dark:bg-black text-black dark:text-white overflow-hidden">
        
        {/* O main ocupa todo o espaço restante de forma flexível */}
        <main className="flex-1 flex flex-col min-h-0">
          {children}
        </main>

        {/* Footer fixado perfeitamente no final, sem criar barra de rolagem */}
        <footer className="w-full text-center text-xs text-zinc-500 py-6 border-t border-zinc-200 dark:border-zinc-900 bg-white dark:bg-black shrink-0">
          AVISO: Esta aplicação é um exercício acadêmico e não substitui orientação médica ou nutricional profissional.
        </footer>
      </body>
    </html>
  );
}