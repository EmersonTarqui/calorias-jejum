"use client"

import { useEffect, useState } from "react"
import { listarRefeicoes, deletarRefeicao, Refeicao } from "@/lib/db"
import { auth } from "@/lib/firebase"
import { RefeicaoForm } from "./_components/refeicao-form"

export default function DashboardPage() {
  // estado inicial vazio, mas tipado para receber um array de objetos Refeicao do banco
  const [refeicoes, setRefeicoes] = useState<Refeicao[]>([])
  const [refeicaoEditando, setRefeicaoEditando] = useState<Refeicao | null>(null)
  
  // inicializa o estado do filtro com a data atual no formato YYYY-MM-DD
  const [dataFiltro, setDataFiltro] = useState(() => {
    const hoje = new Date()
    const ano = hoje.getFullYear()
    const mes = String(hoje.getMonth() + 1).padStart(2, '0')
    const dia = String(hoje.getDate()).padStart(2, '0')
    return `${ano}-${mes}-${dia}`
  })

  // busca os registros vinculados ao id do usuario logado
  async function carregarDados() {
    const user = auth.currentUser
    if (user) {
      const dados = await listarRefeicoes(user.uid)
      setRefeicoes(dados)
    }
  }

  useEffect(() => {
    carregarDados()
  }, [])

  // preenche o formulario com os dados do registro e rola a tela suavemente para o topo
  function handleEditar(refeicao: Refeicao) {
    setRefeicaoEditando(refeicao)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  // executa exclusao no banco e limpa o formulario se o item excluido for o mesmo em edicao
  async function handleExcluir(id?: string) {
    if (!id) return
    
    const confirmou = window.confirm("Tem certeza de que deseja excluir este registro?")
    if (confirmou) {
      await deletarRefeicao(id)
      
      if (refeicaoEditando?.id === id) {
        setRefeicaoEditando(null)
      }
      
      carregarDados()
    }
  }

  // limpa o modo de edicao e recarrega a lista recem-atualizada
  function handleSalvo() {
    carregarDados()
    setRefeicaoEditando(null)
  }

  // cruza a data selecionada no input com a data de criacao de cada refeicao
  const refeicoesFiltradas = refeicoes.filter((r) => {
    if (!r.dataHora) return false
    
    const dataObjeto = r.dataHora instanceof Date ? r.dataHora : r.dataHora.toDate()
    const ano = dataObjeto.getFullYear()
    const mes = String(dataObjeto.getMonth() + 1).padStart(2, '0')
    const dia = String(dataObjeto.getDate()).padStart(2, '0')
    const dataFormatada = `${ano}-${mes}-${dia}`
    
    return dataFormatada === dataFiltro
  })

  // percorre todas as refeições e soma as calorias para gerar o total do dia, começa com 0
  const totalCalorias = refeicoesFiltradas.reduce((acc, r) => acc + r.calorias, 0)

  // constantes de estilo com regras de responsividade
  const cardClasses = "p-4 border border-zinc-200 dark:border-zinc-800 rounded-lg bg-white dark:bg-zinc-900 flex flex-col sm:flex-row sm:justify-between sm:items-center shadow-sm gap-4 sm:gap-0"
  const btnEditar = "bg-blue-600 text-white hover:bg-blue-700 h-9 px-4 py-2 rounded-md text-sm font-medium transition-colors"
  const btnExcluir = "bg-red-500 text-white hover:bg-red-600 h-9 px-4 py-2 rounded-md text-sm font-medium transition-colors"
  const inputFiltro = "p-2 border border-zinc-300 dark:border-zinc-700 rounded-md bg-transparent text-zinc-900 dark:text-white text-sm dark:[color-scheme:dark] w-full sm:w-auto"

  return (
    <div className="max-w-3xl mx-auto space-y-8 mt-4">
      
      <div>
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">Painel de Calorias</h2>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">Registre ou edite suas refeições diárias.</p>
      </div>
      
      <RefeicaoForm 
        onSalvo={handleSalvo} 
        refeicaoEditando={refeicaoEditando} 
        aoCancelar={() => setRefeicaoEditando(null)} 
      />

      <div className="space-y-4">
        
        {/* estrutura do cabecalho com alinhamento adaptativo para resolucoes menores */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center border-b border-zinc-200 dark:border-zinc-800 pb-4 sm:pb-2 gap-3 sm:gap-0">
          <h3 className="font-semibold text-zinc-900 dark:text-white">Histórico</h3>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-sm text-zinc-500 dark:text-zinc-400 whitespace-nowrap">Filtrar por data:</span>
            <input 
              type="date" 
              value={dataFiltro}
              onChange={(e) => setDataFiltro(e.target.value)}
              className={inputFiltro}
            />
          </div>
        </div>

        <div className="bg-zinc-100 dark:bg-zinc-800/50 rounded-lg p-4 flex justify-between items-center">
          <span className="font-medium text-zinc-600 dark:text-zinc-400">Total consumido</span>
          <span className="text-xl font-bold text-zinc-900 dark:text-white">{totalCalorias} kcal</span>
        </div>

        {refeicoesFiltradas.length === 0 ? (
          <p className="text-center text-zinc-500 py-8">Nenhum registro encontrado para esta data.</p>
        ) : (
          refeicoesFiltradas.map((r) => (
            <div key={r.id} className={cardClasses}>
              
              <div className="flex-1">
                <p className="font-medium text-zinc-900 dark:text-white">{r.descricao}</p>
                {/* agrupa as informacoes secundarias com quebra de linha automatica */}
                <div className="flex flex-wrap gap-2 sm:gap-3 text-xs sm:text-sm text-zinc-500 mt-1 items-center">
                  <span className="font-semibold text-zinc-700 dark:text-zinc-300">{r.calorias} kcal</span>
                  <span className="hidden sm:inline">•</span>
                  <span>{r.dataHora instanceof Date ? r.dataHora.toLocaleString('pt-BR') : ''}</span>
                </div>
              </div>
              
              {/* agrupa os blocos de acoes e tags do registro */}
              <div className="flex items-center justify-between w-full sm:w-auto gap-2">
                <span className="text-[10px] px-2 py-1 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 rounded font-bold uppercase tracking-wider">
                  {r.tipoRefeicao}
                </span>
                
                <div className="flex gap-2">
                  <button onClick={() => handleEditar(r)} className={btnEditar}>
                    Editar
                  </button>

                  <button onClick={() => handleExcluir(r.id)} className={btnExcluir}>
                    Excluir
                  </button>
                </div>
              </div>

            </div>
          ))
        )}
      </div>
    </div>
  )
}