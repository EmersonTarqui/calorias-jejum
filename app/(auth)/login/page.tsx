import Link from "next/link";
import { LoginForm } from "./login-form";

export default function LoginPage() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 py-12">
      {/* Garante a largura ideal do formulário sem esmagar o conteúdo */}
      <div className="w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center text-black dark:text-white">
          Entrar na conta
        </h1>
        
        <LoginForm />

        {/* link cadastro */}
        <div className="mt-6 text-center">
          <Link 
            href="/cadastro"  
            className="font-semibold text-black hover:text-gray-700 dark:text-white dark:hover:text-gray-300 transition-colors hover:underline"
          >
            Não tem uma conta? Cadastre-se
          </Link>
        </div>
      </div>
    </div>
  );
}