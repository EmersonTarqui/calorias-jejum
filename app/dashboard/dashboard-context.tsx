"use client"

import { createContext, useContext, useEffect, useState, ReactNode } from "react"
import { listarRefeicoes, buscarMeta, listarJejuns, buscarJejumAtivo, Refeicao, Jejum } from "@/lib/db"
import { auth } from "@/lib/firebase"

// tipagem do escopo de dados gerenciados globalmente no dashboard
interface DashboardContextType {
  refeicoes: Refeicao[];
  meta: number;
  jejumAtivo: Jejum | null;
  historicoJejuns: Jejum[];
  carregarDados: () => Promise<void>;
}

// inicializa a criacao do contexto para gerenciamento global de estados
const DashboardContext = createContext<DashboardContextType | undefined>(undefined)

export function DashboardProvider({ children }: { children: ReactNode }) {
  // inicializa os estados globais para armazenamento em memoria
  const [refeicoes, setRefeicoes] = useState<Refeicao[]>([])
  const [meta, setMeta] = useState(2000)
  const [historicoJejuns, setHistoricoJejuns] = useState<Jejum[]>([])
  const [jejumAtivo, setJejumAtivo] = useState<Jejum | null>(null)

  // executa as chamadas de leitura ao banco de dados de forma simultanea
  async function carregarDados() {
    const user = auth.currentUser
    if (user) {
      const [listaRef, metaUsuario, listaJejum, ativoJejum] = await Promise.all([
        listarRefeicoes(user.uid),
        buscarMeta(user.uid),
        listarJejuns(user.uid),
        buscarJejumAtivo(user.uid)
      ])
      
      setRefeicoes(listaRef)
      setMeta(metaUsuario)
      setHistoricoJejuns(listaJejum)
      setJejumAtivo(ativoJejum)
    }
  }

  // dispara o carregamento inicial dos dados na montagem do provedor
  useEffect(() => { 
    carregarDados() 
  }, [])

  return (
    <DashboardContext.Provider value={{ refeicoes, meta, jejumAtivo, historicoJejuns, carregarDados }}>
      {children}
    </DashboardContext.Provider>
  )
}

// encapsula o acesso ao contexto garantindo a validacao do escopo do provedor
export function useDashboard() {
  const context = useContext(DashboardContext)
  if (!context) throw new Error("useDashboard deve ser executado dentro de um DashboardProvider")
  return context
}