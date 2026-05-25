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
      <body className="min-h-full flex flex-col bg-white dark:bg-zinc-950 text-black dark:text-white">
        
        {/* renderiza as paginas da aplicacao ocupando o espaco flexivel disponivel */}
        <main className="flex-1">
          {children}
        </main>

        {/* rodape global fixo com aviso academico */}
        <footer className="mt-8 text-sm text-zinc-500 dark:text-zinc-400 text-center border-t border-zinc-200 dark:border-zinc-800 py-6">
          AVISO: Esta aplicação é um exercício acadêmico e não substitui orientação médica ou nutricional profissional.
        </footer>
      </body>
    </html>
  );
}