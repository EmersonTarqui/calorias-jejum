"use client"

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter();
  const [carregando, setCarregando] = useState(true);
  const [usuario, setUsuario] = useState<User | null>(null);

  // monitora o estado de autenticacao e redireciona usuarios nao autenticados
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push("/login");
      } else {
        setUsuario(user);
        setCarregando(false);
      }
    });

    return () => unsubscribe();
  }, [router]);

  // exibe prompt de confirmacao nativo antes de encerrar a sessao do usuario
  async function handleSair() {
    const confirmou = window.confirm("Tem certeza de que deseja sair do sistema?");
    if (confirmou) {
      await signOut(auth);
      router.push("/login");
    }
  }

  // renderiza estado de loading enquanto aguarda validacao do firebase
  if (carregando) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-zinc-500 dark:text-zinc-400">Carregando...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm">
        <div className="max-w-3xl mx-auto px-4 h-16 flex justify-between items-center w-full">
          
          <h1 className="font-bold text-2xl text-zinc-900 dark:text-white">Meu Painel</h1>
          
          <div className="flex items-center gap-4">
            <span className="text-sm text-zinc-500 dark:text-zinc-400 hidden sm:block">
              Olá, <span className="font-semibold text-zinc-900 dark:text-zinc-200">{usuario?.displayName || usuario?.email?.split('@')[0]}</span>
            </span>
            
            <button 
              onClick={handleSair}
              className="bg-red-500 text-white hover:bg-red-600 h-9 px-4 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Sair
            </button>
          </div>
        </div>
      </header>

      <div className="flex-1 px-4">
        {children}
      </div>
    </div>
  );
}