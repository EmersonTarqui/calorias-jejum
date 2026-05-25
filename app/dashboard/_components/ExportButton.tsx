"use client"

import { RefeicaoCompleta } from "@/lib/schemas/refeicao";

export function ExportButton({ data, filename = "relatorio.csv" }: { data: RefeicaoCompleta[], filename?: string }) {
  
  const handleExport = () => {
    if (!data || data.length === 0) return;

    // Cabeçalho define os nomes das colunas com separador ;
    const cabecalho = "ID;Descricao;Calorias;Tipo;Data;UsuarioID\n";

    // Mapeamos cada item do array para uma linha de texto (CSV)
    const linhas = data.map((item: RefeicaoCompleta) => {
      // Converte o Timestamp do Firebase para um formato de data legível
      const dataFormatada = item.dataHora?.toDate ? item.dataHora.toDate().toISOString() : new Date(item.dataHora as any).toISOString();
      
      // Monta a linha com aspas e separador ;
      return `"${item.id}";"${item.descricao}";"${item.calorias}";"${item.tipoRefeicao}";"${dataFormatada}";"${item.userId}"`;
    }).join("\n"); 

    // Junta cabeçalho
    const conteudo = "\uFEFF" + cabecalho + linhas;

    // Cria o Container(blob) que mantém esses dados na memória
    const blob = new Blob([conteudo], { type: 'text/csv;charset=utf-8;' });

    // Cria uma URL temporária apontando para esse objeto na memória
    const url = URL.createObjectURL(blob);

    // Cria um link invisível e clica nele para forçar o download no navegador
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();
  };

  return (
    <button 
      onClick={handleExport}
      className="bg-zinc-800 text-white px-4 py-2 rounded-md hover:bg-black"
    >
      Exportar CSV
    </button>
  );
}