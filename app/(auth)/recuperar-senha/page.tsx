import Link from "next/link";
import { RecuperarForm } from "./recuperar-form";

export default function RecuperarSenhaPage() {
  return (
    <main className="max-w-md mx-auto py-12 px-4">
      <h1 className="text-2xl font-bold mb-6 text-center">Recuperar senha</h1>
      <RecuperarForm />
      <div className="mt-6 text-center">
        <Link href="/login" className="text-sm text-gray-600 hover:underline">voltar para o login</Link>
      </div>
    </main>
  );
}