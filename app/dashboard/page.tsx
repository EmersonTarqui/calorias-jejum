"use client"

import { useState } from "react"
import { RefeicoesTab } from "./_components/refeicoes-tab"
import { JejumTab } from "./_components/jejum-tab"
import { DashboardProvider } from "./dashboard-context"

export default function DashboardPage() {
  // gerencia o estado da aba selecionada no painel principal
  const [abaAtiva, setAbaAtiva] = useState<"refeicoes" | "jejum">("refeicoes")

  // aplica estilizacao condicional para destacar a aba ativa na navegacao
  const btnTab = (aba: typeof abaAtiva) => `pb-4 text-sm font-medium border-b-2 transition-colors ${
    abaAtiva === aba 
      ? "border-blue-600 text-blue-600 dark:text-blue-400" 
      : "border-transparent text-zinc-500 hover:text-zinc-700 dark:text-zinc-400"
  }`

  return (
    <DashboardProvider>
      <div className="max-w-3xl mx-auto mt-4 space-y-6">
        
        {/* controles de navegacao principal do painel */}
        <div className="flex gap-6 border-b border-zinc-200 dark:border-zinc-800">
          <button onClick={() => setAbaAtiva("refeicoes")} className={btnTab("refeicoes")}>Refeições</button>
          <button onClick={() => setAbaAtiva("jejum")} className={btnTab("jejum")}>Jejum</button>
        </div>

        {/* aplica visibilidade condicional baseada na aba ativa para evitar desmontagem do componente no DOM */}
        <div className={abaAtiva === "refeicoes" ? "block" : "hidden"}>
          <RefeicoesTab />
        </div>
        
        {/* aplica visibilidade condicional baseada na aba ativa para evitar desmontagem do componente no DOM */}
        <div className={abaAtiva === "jejum" ? "block" : "hidden"}>
          <JejumTab />
        </div>
        
      </div>
    </DashboardProvider>
  )
}