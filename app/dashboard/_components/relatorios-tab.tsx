"use client"

import { useEffect, useState } from "react"
import { useDashboard } from "../dashboard-context"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  CartesianGrid
} from "recharts"

export function RelatoriosTab() {
  const { refeicoes, meta, historicoJejuns } = useDashboard()

  // evita erro do gráfico ao carregar no servidor
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setIsMounted(true), 50)
    return () => clearTimeout(timer)
  }, [])

  // cria uma lista com os últimos 7 dias
  const ultimos7Dias = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (6 - i))
    return d.toISOString().split("T")[0]
  })

  const dadosCalorias = ultimos7Dias.map(dia => {
    const total = refeicoes

      // pega só as refeições do dia atual
      .filter(
        r =>
          (
            r.dataHora instanceof Date
              ? r.dataHora
              : r.dataHora.toDate()
          )
            .toISOString()
            .split("T")[0] === dia
      )

      // soma as calorias do dia
      .reduce((total, r) => total + r.calorias, 0)

    const [, mes, d] = dia.split("-")

    return {
      dia: `${d}/${mes}`,
      calorias: total
    }
  })

  const dadosJejum = ultimos7Dias.map(dia => {
    const totalHoras = historicoJejuns

      // pega só jejuns finalizados do dia
      .filter(
        j =>
          j.fim &&
          j.fim.toDate().toISOString().split("T")[0] === dia
      )

      // soma o total de horas de jejum
      .reduce((total, j) => {
        const diffMs =
          j.fim!.toDate().getTime() -
          j.inicio.toDate().getTime()

        return total + diffMs / 3600000
      }, 0)

    const [, mes, d] = dia.split("-")

    return {
      dia: `${d}/${mes}`,
      horas: Number(totalHoras.toFixed(1))
    }
  })

  // média de calorias por dia
  const mediaCalorias = Math.round(
    refeicoes.reduce((total, r) => total + r.calorias, 0) / 7
  )

  // pega só jejuns concluídos
  const jejunsConcluidos = historicoJejuns.filter(j => j.fim !== null)

  // média de horas dos jejuns concluídos
  const mediaJejum =
    jejunsConcluidos.length > 0
      ? Math.round(
          jejunsConcluidos.reduce((total, j) => {
            const diffMs =
              j.fim!.toDate().getTime() -
              j.inicio.toDate().getTime()

            return total + diffMs / 3600000
          }, 0) / jejunsConcluidos.length
        )
      : 0

  // maior valor entre calorias do gráfico e a meta
  const maxCalorias = Math.max(
    ...dadosCalorias.map(d => d.calorias),
    meta
  )

  // maior valor entre horas do gráfico e 16h
  const maxHoras = Math.max(
    ...dadosJejum.map(d => d.horas),
    16
  )

  const cardIndicador =
    "p-5 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-900 shadow-sm"

  return (
    <div className="space-y-6">

      {/* indicadores da semana */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className={cardIndicador}>
          <p className="text-xs text-zinc-500 font-medium uppercase tracking-wider">
            Média calórica/dia (7 dias)
          </p>
          <p className="text-2xl font-bold text-zinc-900 dark:text-white mt-1">
            {mediaCalorias} kcal
          </p>
          <p className="text-xs text-blue-500 dark:text-blue-400 mt-2 font-medium">
            meta: {meta} kcal/dia
          </p>
        </div>

        <div className={cardIndicador}>
          <p className="text-xs text-zinc-500 font-medium uppercase tracking-wider">
            Jejuns na semana
          </p>
          <p className="text-2xl font-bold text-zinc-900 dark:text-white mt-1">
            {jejunsConcluidos.length}
          </p>
          <p className="text-xs text-blue-500 dark:text-blue-400 mt-2 font-medium">
            jejuns concluídos
          </p>
        </div>

        <div className={cardIndicador}>
          <p className="text-xs text-zinc-500 font-medium uppercase tracking-wider">
            Tempo médio jejum
          </p>
          <p className="text-2xl font-bold text-zinc-900 dark:text-white mt-1">
            {mediaJejum}h
          </p>
         <p className="text-xs text-blue-500 dark:text-blue-400 mt-2 font-medium">
            referência: 16h (protocolo 16/8)
          </p>
        </div>
      </div>

      {/* gráficos */}
      <div className="grid grid-cols-1 gap-6">

        {/* gráfico de calorias */}
        <div className="p-4 sm:p-6 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-900 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2 gap-1">
            <h3 className="font-semibold text-zinc-900 dark:text-white">Consumo Semanal (kcal)</h3>
            <div className="flex items-center gap-2">
              <span className="inline-block w-6 h-0.5 bg-red-500 border-dashed border-t-2 border-red-500"></span>
              <span className="text-xs text-zinc-400">meta diária: {meta} kcal</span>
            </div>
          </div>

          {!isMounted
            ? <div className="h-64 bg-zinc-100 dark:bg-zinc-800 rounded animate-pulse" />
            : (
              <ResponsiveContainer key="grafico-calorias" width="99%" height={256}>
                <BarChart data={dadosCalorias} margin={{ bottom: 20, top: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#3f3f46" />
                  <XAxis dataKey="dia" stroke="#888" fontSize={10} tickLine={false} axisLine={false} angle={-45} textAnchor="end" height={40} />
                  <YAxis stroke="#888" fontSize={11} tickLine={false} axisLine={false} allowDecimals={false} width={45} domain={[0, maxCalorias + 100]} />
                  <Tooltip
                    cursor={{ fill: '#f4f4f5', opacity: 0.1 }}
                    contentStyle={{ backgroundColor: '#18181b', border: 'none', borderRadius: '8px', color: '#fff', fontSize: 12 }}
                  />
                  <ReferenceLine y={meta} stroke="#ef4444" strokeDasharray="4 4" />
                  <Bar dataKey="calorias" fill="#2563eb" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )
          }
        </div>

        {/* gráfico: horas de jejum semanal */}
        <div className="p-4 sm:p-6 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-900 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2 gap-1">
            <h3 className="font-semibold text-zinc-900 dark:text-white">Jejum Semanal (horas)</h3>
            <div className="flex items-center gap-2">
              <span className="inline-block w-6 h-0.5 bg-red-500 border-dashed border-t-2 border-red-500"></span>
              <span className="text-xs text-zinc-400">meta: 16h (protocolo 16/8)</span>
            </div>
          </div>

          {!isMounted
            ? <div className="h-64 bg-zinc-100 dark:bg-zinc-800 rounded animate-pulse" />
            : (
              <ResponsiveContainer key="grafico-jejum" width="99%" height={256}>
                <BarChart data={dadosJejum} margin={{ bottom: 20, top: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#3f3f46" />
                  <XAxis dataKey="dia" stroke="#888" fontSize={10} tickLine={false} axisLine={false} angle={-45} textAnchor="end" height={40} />
                  <YAxis stroke="#888" fontSize={11} tickLine={false} axisLine={false} allowDecimals={false} width={35} domain={[0, maxHoras + 2]} />
                  <Tooltip
                    cursor={{ fill: '#f4f4f5', opacity: 0.1 }}
                    contentStyle={{ backgroundColor: '#18181b', border: 'none', borderRadius: '8px', color: '#fff', fontSize: 12 }}
                  />
                  <ReferenceLine y={16} stroke="#ef4444" strokeDasharray="4 4" />
                  <Bar dataKey="horas" fill="#a855f7" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )
          }
        </div>
      </div>
    </div>
  )
}