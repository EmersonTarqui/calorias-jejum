"use client"

import { useForm, SubmitHandler } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { refeicaoSchema, RefeicaoInput } from "@/lib/schemas/refeicao"
import { salvarRefeicao, atualizarRefeicao, Refeicao } from "@/lib/db"
import { useState, useEffect } from "react"

// componente de formulario que gerencia a criacao e edicao de registros de refeicao
export function RefeicaoForm({ 
  onSalvo, 
  refeicaoEditando, 
  aoCancelar 
}: { 
  onSalvo: () => void, 
  refeicaoEditando?: Refeicao | null,
  aoCancelar?: () => void
}) {
  const [loading, setLoading] = useState(false)
  
  const form = useForm<RefeicaoInput>({
    resolver: zodResolver(refeicaoSchema),
    defaultValues: { descricao: "", calorias: 0, tipoRefeicao: "lanche" }
  })

  // monitora o estado de edicao e preenche os campos do formulario caso uma refeicao seja selecionada
  useEffect(() => {
    if (refeicaoEditando) {
      form.reset({
        descricao: refeicaoEditando.descricao,
        calorias: refeicaoEditando.calorias,
        tipoRefeicao: refeicaoEditando.tipoRefeicao
      })
    } else {
      form.reset({ descricao: "", calorias: 0, tipoRefeicao: "lanche" })
    }
  }, [refeicaoEditando, form])

  const onSubmit: SubmitHandler<RefeicaoInput> = async (data) => {
    setLoading(true)
    try {
      if (refeicaoEditando?.id) {
        // atualiza um registro existente se a propriedade id estiver presente
        await atualizarRefeicao(refeicaoEditando.id, {
          descricao: data.descricao,
          calorias: data.calorias,
          tipoRefeicao: data.tipoRefeicao,
        })
      } else {
        // cria um novo registro caso nenhum id seja fornecido
        await salvarRefeicao({
          descricao: data.descricao,
          calorias: data.calorias,
          tipoRefeicao: data.tipoRefeicao,
          dataHora: new Date()
        })
      }
      
      form.reset() 
      onSalvo() 
    } catch (erro) {
      console.error("Erro ao salvar:", erro)
    } finally {
      setLoading(false)
    }
  }

  const inputClasses = "w-full p-2 border border-zinc-300 dark:border-zinc-700 rounded bg-transparent text-black dark:text-white placeholder:text-zinc-400"

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="p-4 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg shadow space-y-4">
      
      {/* renderiza alerta informativo e o botao de cancelamento quando o formulario esta em modo de edicao */}
      {refeicaoEditando && (
        <div className="flex justify-between items-center bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 p-2 rounded text-sm">
          <span>Editando: <b>{refeicaoEditando.descricao}</b></span>
          <button type="button" onClick={aoCancelar} className="underline">Cancelar</button>
        </div>
      )}

      <input {...form.register("descricao")} placeholder="Descrição do alimento" className={inputClasses} />
      
      <input 
        type="number" 
        {...form.register("calorias", { valueAsNumber: true })} 
        placeholder="Calorias" 
        className={inputClasses} 
      />
      
      <select {...form.register("tipoRefeicao")} className={inputClasses}>
        <option value="café" className="dark:bg-zinc-900">Café</option>
        <option value="almoço" className="dark:bg-zinc-900">Almoço</option>
        <option value="lanche" className="dark:bg-zinc-900">Lanche</option>
        <option value="jantar" className="dark:bg-zinc-900">Jantar</option>
        <option value="ceia" className="dark:bg-zinc-900">Ceia</option>
      </select>
      
      <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition-colors">
        {loading ? "Processando..." : (refeicaoEditando ? "Salvar Edição" : "Adicionar Refeição")}
      </button>
    </form>
  )
}