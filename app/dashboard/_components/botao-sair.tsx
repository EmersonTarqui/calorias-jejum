"use client"

import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";

export function BotaoSair() {
  // hook de navegacao
  const router = useRouter()

  async function handleLogout() {
    try {
      // desloga o usuario no firebase
      await signOut(auth);
      
      // redireciona o usuario de volta para a tela de login
      router.push("/login");
    } catch (error) {
      console.error("erro ao sair:", error);
    }
  }

  return (
    <button
      onClick={handleLogout}
      className="text-sm font-semibold text-red-600 hover:underline dark:text-red-500"
    >
      sair da conta
    </button>
  )
}