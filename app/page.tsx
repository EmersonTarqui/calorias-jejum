import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-zinc-50 dark:bg-black">
      <div className="max-w-2xl text-center flex flex-col items-center gap-6">
        <h1 className="text-4xl font-bold tracking-tight text-black dark:text-white sm:text-6xl">
          Sistema de Calorias e Jejum
        </h1>
        
        <p className="text-lg leading-8 text-zinc-600 dark:text-zinc-400 max-w-lg">
          Acompanhe suas refeições diárias, defina suas metas calóricas e gerencie seus ciclos de jejum intermitente de forma simples e direta.
        </p>

        <div className="mt-4 flex items-center justify-center gap-x-6">
          <Link
            href="/cadastro"
            className="rounded-md bg-black px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-zinc-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black dark:bg-white dark:text-black dark:hover:bg-zinc-200"
          >
            criar conta
          </Link>
          
          <Link
            href="/login"
            className="text-sm font-semibold leading-6 text-black dark:text-white hover:underline"
          >
            já tenho conta <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </main>
  );
}