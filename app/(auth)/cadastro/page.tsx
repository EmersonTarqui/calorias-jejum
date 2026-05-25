import Link from "next/link";
import { CadastroForm } from "./cadastro-form";

export default function CadastroPage() {
  return (
    // flex-1 faz ocupar todo o espaço entre o topo e o rodapé global
    <div className="flex-1 flex flex-col items-center justify-center px-4 py-12">
      {/* Garante a largura ideal do formulário sem esmagar o conteúdo */}
      <div className="w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center text-black dark:text-white">
          Criar conta
        </h1>
        
        <CadastroForm />

        {/* Link para o login */}
        <div className="mt-6 text-center">
          <Link 
            href="/login" 
            className="text-sm text-gray-600 hover:text-black dark:text-gray-400 dark:hover:text-white hover:underline"
          >
            Já possui uma conta? Faça Login
          </Link>
        </div>
      </div>
    </div>
  );
}