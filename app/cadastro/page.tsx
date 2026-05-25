import Link from "next/link";
import { CadastroForm } from "./cadastro-form";

export default function CadastroPage() {
  return (
    <main className="max-w-md mx-auto py-12 px-4 flex flex-col min-h-screen">
      <div className="flex-grow">
        <h1 className="text-2xl font-bold mb-6 text-center">Criar conta</h1>
        <CadastroForm />

        {/* link login */}
        <div className="mt-6 text-center">
          <Link href="/login" className="text-sm text-gray-600 hover:text-black dark:text-gray-400 dark:hover:text-white">
            Já possui uma conta? Faça Login
          </Link>
        </div>
      </div>

      {/* aviso footer */}
      <footer className="mt-8 text-xs text-gray-500 text-center border-t pt-4">
        AVISO: esta aplicacao é um exercicio acâdemico e nao substitui orientacao médica ou nutricional profissional.
      </footer>
    </main>
  );
}