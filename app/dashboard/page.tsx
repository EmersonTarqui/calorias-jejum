"use client"

import { useEffect, useState } from "react"
import { listarRefeicoes, deletarRefeicao, Refeicao, buscarMeta, salvarMeta } from "@/lib/db"
import { auth } from "@/lib/firebase"
import { RefeicaoForm } from "./_components/refeicao-form"

export default function DashboardPage() {
  // estado inicial vazio, mas tipado para receber um array de objetos Refeicao do banco
  const [refeicoes, setRefeicoes] = useState<Refeicao[]>([])
  const [refeicaoEditando, setRefeicaoEditando] = useState<Refeicao | null>(null)
  
  // armazena a meta calorica definida pelo usuario e o valor do input temporario
  const [meta, setMeta] = useState(2000)
  const [inputMeta, setInputMeta] = useState(2000)
  
  // inicializa o estado do filtro com a data atual no formato YYYY-MM-DD
  const [dataFiltro, setDataFiltro] = useState(() => {
    const hoje = new Date()
    const ano = hoje.getFullYear()
    const mes = String(hoje.getMonth() + 1).padStart(2, '0')
    const dia = String(hoje.getDate()).padStart(2, '0')
    return `${ano}-${mes}-${dia}`
  })

  // busca os registros e a meta vinculados ao id do usuario logado
  async function carregarDados() {
    const user = auth.currentUser
    if (user) {
      const [lista, metaUsuario] = await Promise.all([
        listarRefeicoes(user.uid),
        buscarMeta(user.uid)
      ])
      setRefeicoes(lista)
      setMeta(metaUsuario)
      setInputMeta(metaUsuario)
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

  // valida e atualiza a meta no banco de dados e sincroniza o estado local
  async function handleSalvarMeta() {
    if (inputMeta < 1) {
      alert("A meta diária precisa ser maior que zero.")
      return
    }

    const user = auth.currentUser
    if (user) {
      await salvarMeta(user.uid, inputMeta)
      setMeta(inputMeta)
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

  // calcula a porcentagem do consumo em relação a meta para a barra de progresso
  const progresso = Math.min((totalCalorias / meta) * 100, 100)

  // constantes de estilo com regras de responsividade
  const cardClasses = "p-4 border border-zinc-200 dark:border-zinc-800 rounded-lg bg-white dark:bg-zinc-900 flex flex-col sm:flex-row sm:justify-between sm:items-center shadow-sm gap-4 sm:gap-0"
  const btnEditar = "bg-blue-600 text-white hover:bg-blue-700 h-9 px-4 py-2 rounded-md text-sm font-medium transition-colors"
  const btnExcluir = "bg-red-500 text-white hover:bg-red-600 h-9 px-4 py-2 rounded-md text-sm font-medium transition-colors"
  const inputFiltro = "p-2 border border-zinc-300 dark:border-zinc-700 rounded-md bg-transparent text-zinc-900 dark:text-white text-sm dark:[color-scheme:dark] w-full sm:w-auto"

  return (
    <div className="max-w-3xl mx-auto space-y-6 mt-4">
      
      <div>
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">Painel de Calorias</h2>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">Registre ou edite suas refeições diárias.</p>
      </div>
      
      {/* status section: meta e progresso em destaque no topo */}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="p-4 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg shadow-sm space-y-3">
          <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">Progresso do dia</h3>
          <div className="flex justify-between items-end">
            <span className="text-3xl font-bold text-blue-600 dark:text-blue-500">{totalCalorias}</span>
            <span className="text-sm text-zinc-500 dark:text-zinc-400">meta: {meta} kcal</span>
          </div>
          <div className="w-full bg-zinc-200 dark:bg-zinc-700 rounded-full h-2.5">
            <div className="bg-blue-600 h-2.5 rounded-full transition-all duration-300" style={{ width: `${progresso}%` }}></div>
          </div>
        </div>

        <div className="p-4 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg shadow-sm space-y-3">
          <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">Configurar Meta Diária</h3>
          <div className="flex gap-2">
            <input 
              type="number"
              min="1"
              value={inputMeta}
              onChange={(e) => setInputMeta(Number(e.target.value))}
              className="flex-1 p-2 border border-zinc-300 dark:border-zinc-700 rounded bg-transparent text-zinc-900 dark:text-white text-sm"
            />
            <button 
              onClick={handleSalvarMeta}
              className="bg-blue-600 text-white px-4 py-2 rounded text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              Salvar
            </button>
          </div>
        </div>
      </div>
      
      <RefeicaoForm 
        onSalvo={handleSalvo} 
        refeicaoEditando={refeicaoEditando} 
        aoCancelar={() => setRefeicaoEditando(null)} 
      />

      <div className="space-y-4">
        
        {/* histórico section: controle e lista de registros */}
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