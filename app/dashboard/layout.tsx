"use client"

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter();
  
  // estado para travar a tela enquanto verifica o firebase
  const [carregando, setCarregando] = useState(true);

  // monitora o status do usuario
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        // se nao tem usuario logado, expulsa pro login
        router.push("/login");
      } else {
        // se tem usuario, libera a renderizacao da pagina
        setCarregando(false);
      }
    });

    // limpa o monitoramento se sair do layout
    return () => unsubscribe();
  }, [router]);

  // mostra estado de ui enquanto pensa (exigencia da atividade)
  if (carregando) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-gray-500 dark:text-gray-400">carregando...</p>
      </div>
    );
  }

  // se a validacao passou, mostra o conteudo da pagina (children)
  return <>{children}</>;
}