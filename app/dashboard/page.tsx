"use client"

import { useState } from "react"
import { RefeicoesTab } from "./_components/refeicoes-tab"
import { JejumTab } from "./_components/jejum-tab"
import { DashboardProvider } from "./dashboard-context"
import { RelatoriosTab } from "./_components/relatorios-tab"

export default function DashboardPage() {
  // gerencia a aba ativa no painel
  const [abaAtiva, setAbaAtiva] = useState<"refeicoes" | "jejum" | "relatorios">("refeicoes")

  // define estilo dos botões de navegação
  const btnTab = (aba: typeof abaAtiva) => `pb-4 text-sm font-medium border-b-2 transition-colors ${
    abaAtiva === aba 
      ? "border-blue-600 text-blue-600 dark:text-blue-400" 
      : "border-transparent text-zinc-500 hover:text-zinc-700 dark:text-zinc-400"
  }`

  return (
    <DashboardProvider>
      <div className="max-w-3xl mx-auto mt-4 space-y-6">
        
        {/* navegação do painel */}
        <div className="flex gap-6 border-b border-zinc-200 dark:border-zinc-800">
          <button onClick={() => setAbaAtiva("refeicoes")} className={btnTab("refeicoes")}>Refeições</button>
          <button onClick={() => setAbaAtiva("jejum")} className={btnTab("jejum")}>Jejum</button>
          <button onClick={() => setAbaAtiva("relatorios")} className={btnTab("relatorios")}>Relatórios</button>
        </div>

        {/* exibe abas com display hidden para manter estado de temporizadores */}
        <div className={abaAtiva === "refeicoes" ? "block" : "hidden"}>
          <RefeicoesTab />
        </div>
        
        <div className={abaAtiva === "jejum" ? "block" : "hidden"}>
          <JejumTab />
        </div>

        {/* renderização condicional do gráfico para evitar erro de cálculo de container do Recharts */}
        {abaAtiva === "relatorios" && <RelatoriosTab />}
        
      </div>
    </DashboardProvider>
  )
}