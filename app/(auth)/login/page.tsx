import Link from "next/link";
import { LoginForm } from "./login-form";

export default function LoginPage() {
  return (
    <main className="max-w-md mx-auto py-12 px-4 flex flex-col min-h-screen">
      <div className="flex-grow">
        <h1 className="text-2xl font-bold mb-6 text-center">Entrar na conta</h1>
        
        <LoginForm />

        {/* link cadastro */}
        <div className="mt-6 text-center">
          <Link href="/cadastro" className="text-sm text-gray-600 hover:text-black dark:text-gray-400 dark:hover:text-white">
            Não tem uma conta? Cadastre-se
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