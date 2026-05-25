"use client"

import { useEffect, useState } from "react"
import { Timestamp } from "firebase/firestore"
import { auth } from "@/lib/firebase"
import { iniciarJejum, encerrarJejum } from "@/lib/db"
import { useDashboard } from "../dashboard-context"

export function JejumTab() {
  // extrai os estados globais e a funcao de sincronizacao do contexto
  const { jejumAtivo, historicoJejuns, carregarDados } = useDashboard()
  
  // inicializa os estados locais para gerenciar campos do formulario e cronometro
  const [tipo, setTipo] = useState("16:8")
  // estado do input agora tipado para aceitar numeros (ou vazio pra n dar erro no react)
  const [tipoPersonalizado, setTipoPersonalizado] = useState<number | "">("")
  const [tempoDecorrido, setTempoDecorrido] = useState("00:00:00")

  // monitora o objeto de jejum ativo para calcular e atualizar o tempo real na interface
  useEffect(() => {
    if (!jejumAtivo) {
      setTempoDecorrido("00:00:00")
      return
    }

    const interval = setInterval(() => {
      const agora = new Date().getTime()
      const inicio = jejumAtivo.inicio.toDate().getTime()
      const diffMs = agora - inicio

      // extrai as fracoes de tempo em unidades padrao para montagem da string do cronometro
      const h = Math.floor(diffMs / 3600000).toString().padStart(2, '0')
      const m = Math.floor((diffMs % 3600000) / 60000).toString().padStart(2, '0')
      const s = Math.floor((diffMs % 60000) / 1000).toString().padStart(2, '0')
      
      setTempoDecorrido(`${h}:${m}:${s}`)
    }, 1000)

    return () => clearInterval(interval)
  }, [jejumAtivo])

  // valida o usuario autenticado e persiste o inicio de um novo ciclo na base de dados
  async function handleIniciar() {
    const user = auth.currentUser
    if (user) {
      let tipoFinal = tipo

      // se for personalizado, faz a conta automatica pra salvar bonito no banco
      // ex: digita 14 horas de jejum -> 24 - 14 = 10 -> salva "14:10"
      if (tipo === "Personalizado" && typeof tipoPersonalizado === "number") {
        const horasJejum = tipoPersonalizado
        const horasComendo = 24 - horasJejum
        tipoFinal = `${horasJejum}:${horasComendo}`
      }

      // salva o inicio do jejum
      await iniciarJejum(user.uid, tipoFinal)
      // atualiza os dados na tela
      carregarDados()
    }
  }

  // registra a interrupcao do ciclo ativo mediante confirmacao e sincroniza o estado
  async function handleEncerrar() {
    const confirmou = window.confirm("Deseja realmente encerrar o jejum?")
    if (confirmou && jejumAtivo?.id) {
      await encerrarJejum(jejumAtivo.id)
      carregarDados()
    }
  }

  // executa o calculo de diferenca temporal entre as ancoras e formata a exibicao em horas, minutos e segundos
  function formatarDuracao(inicio: Timestamp, fim: Timestamp | null): string {

    // se ainda nao existe hora de fim,
    // significa que a atividade ainda esta rolando
    if (!fim) return "Em andamento"
    
    // transforma as datas em milissegundos e faz a diferenca
    const diffMs = fim.toDate().getTime() - inicio.toDate().getTime()
    // pega quantas horas completas existem nessa diferenca
    // 3600000 = quantidade de ms em 1 hora
    const horas = Math.floor(diffMs / 3600000)
    // pega os minutos restantes depois de tirar as horas, % pega o "resto" da conta
    const minutos = Math.floor((diffMs % 3600000) / 60000)
    // pega os segundos restantes depois de tirar minutos e horas
    const segundos = Math.floor((diffMs % 60000) / 1000)

    // retorna o tempo formatado
    return `${horas}h ${minutos}m ${segundos}s`
  }

  return (
    <div className="space-y-6">
      
      {/* section: condicional de interface alternando entre controle ativo e formulario de criacao */}
      <div className="p-4 border border-zinc-200 dark:border-zinc-800 rounded-lg bg-white dark:bg-zinc-900">
        {!jejumAtivo ? (
          <div className="space-y-4">
            <h3 className="font-semibold text-zinc-900 dark:text-white">Iniciar novo jejum</h3>
            <select value={tipo} onChange={(e) => setTipo(e.target.value)} className="w-full p-2 border border-zinc-300 dark:border-zinc-700 rounded bg-transparent text-zinc-900 dark:text-white">
              <option value="16:8" className="dark:bg-zinc-900">16:8</option>
              <option value="18:6" className="dark:bg-zinc-900">18:6</option>
              <option value="20:4" className="dark:bg-zinc-900">20:4</option>
              <option value="24h" className="dark:bg-zinc-900">24h</option>
              <option value="Personalizado" className="dark:bg-zinc-900">Personalizado</option>
            </select>
            
            {tipo === "Personalizado" && (
              <div className="flex flex-col gap-1">
                <label className="text-xs text-zinc-500">Quantas horas de jejum?</label>
                <div className="flex items-center gap-2">
                  <input 
                    type="number" 
                    min="1"
                    max="23"
                    placeholder="Ex: 14" 
                    value={tipoPersonalizado} 
                    onChange={(e) => setTipoPersonalizado(Number(e.target.value))} 
                    className="flex-1 p-2 border border-zinc-300 dark:border-zinc-700 rounded bg-transparent text-zinc-900 dark:text-white" 
                  />
                  <span className="text-sm text-zinc-500 whitespace-nowrap dark:text-zinc-400">horas</span>
                </div>
              </div>
            )}
            
            <button 
              onClick={handleIniciar} 
              disabled={tipo === "Personalizado" && (!tipoPersonalizado || tipoPersonalizado < 1 || tipoPersonalizado > 23)}
              className="w-full bg-blue-600 text-white py-2 rounded font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Iniciar Jejum
            </button>
          </div>
        ) : (
          <div className="space-y-4 text-center">
            <div>
              <p className="text-sm text-zinc-500">Jejum em andamento ({jejumAtivo.tipo})</p>
              <p className="text-4xl font-mono font-bold text-blue-600 dark:text-blue-400 mt-2">{tempoDecorrido}</p>
              <p className="text-xs text-zinc-400 mt-1">Iniciado em: {jejumAtivo.inicio.toDate().toLocaleTimeString()}</p>
            </div>
            <button onClick={handleEncerrar} className="w-full bg-red-600 text-white py-2 rounded font-medium hover:bg-red-700 transition-colors">
              Encerrar Jejum
            </button>
          </div>
        )}
      </div>

      {/* section: iteracao da matriz de registros inativos em historico ordenado */}
      <div className="space-y-3">
        <h3 className="font-semibold text-zinc-900 dark:text-white">Histórico</h3>
        {historicoJejuns.length === 0 ? (
           <p className="text-sm text-zinc-500 text-center py-4">Nenhum jejum registrado.</p>
        ) : (
          historicoJejuns.map((j) => (
            <div key={j.id} className="p-3 border border-zinc-200 dark:border-zinc-800 rounded-lg flex justify-between items-center text-sm">
              <div>
                <p className="font-medium text-zinc-700 dark:text-zinc-300">{j.tipo}</p>
                <p className="text-xs text-zinc-500">Iniciado em: {j.inicio.toDate().toLocaleDateString()}</p>
                <p className="text-xs text-zinc-500">Encerrado em: {j.fim?.toDate().toLocaleTimeString()}</p>
              </div>
              <span className="font-bold text-blue-600 dark:text-blue-400">
                {formatarDuracao(j.inicio, j.fim)}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  )
}