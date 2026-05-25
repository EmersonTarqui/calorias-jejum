import { BotaoSair } from "./_components/botao-sair";

export default function DashboardPage() {
  return (
    <main className="max-w-4xl mx-auto py-12 px-4 flex flex-col min-h-screen">
      <div className="flex-grow">
        
        {/* cabecalho do dashboard com titulo e botao */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Painel Geral</h1>
          <BotaoSair />
        </div>
        
        <p className="text-gray-600 dark:text-gray-400">
          gráficos de calorias e o histórico de jejum...
        </p>
      </div>
    </main>
  );
}