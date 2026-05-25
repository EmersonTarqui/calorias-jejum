"use client" // Importante: adicione isso no topo

import Link from "next/link"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { auth } from "@/lib/firebase"

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        router.push("/dashboard")
      }
    })
    return () => unsubscribe()
  }, [router])

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-zinc-50 dark:bg-black transition-colors duration-300">
      <div className="max-w-2xl text-center flex flex-col items-center gap-6">
        <h1 className="text-5xl font-extrabold tracking-tight text-black dark:text-white sm:text-7xl">
          Sistema de <span className="text-zinc-500">Calorias e Jejum</span>
        </h1>
        
        <p className="text-xl leading-8 text-zinc-600 dark:text-zinc-400 max-w-lg">
          Gerencie seu consumo calórico e ciclos de jejum com uma interface limpa, focada no que realmente importa.
        </p>

        <div className="mt-6 flex items-center justify-center gap-x-6">
          <Link
            href="/cadastro"
            className="rounded-full bg-black px-8 py-4 text-sm font-bold text-white shadow-lg transition-all hover:scale-105 hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
          >
            Começar agora
          </Link>
          
          <Link
            href="/login"
            className="text-sm font-semibold leading-6 text-black dark:text-white hover:underline decoration-2 underline-offset-4"
          >
            Acessar conta →
          </Link>
        </div>
      </div>
    </main>
  );
}