"use server";

import { cadastroSchema } from "@/lib/schemas/cadastro";

// define o formato do estado retornado pela action
export type CadastroState = {
  success: boolean;
  message?: string;
  erros?: {
    nome?: string[];
    email?: string[];
    senha?: string[];
  };
};

// server action de cadastro focada apenas na validacao de seguranca
export async function cadastrarAction(
  _prevState: CadastroState,
  formData: FormData
): Promise<CadastroState> {
  // converte o FormData em objeto
  const dados = Object.fromEntries(formData);
  
  // valida os dados usando o schema do zod
  const resultado = cadastroSchema.safeParse(dados);

  if (!resultado.success) {
    return {
      success: false,
      message: "dados invalidos",
      erros: resultado.error.flatten().fieldErrors,
    };
  }

  // servidor aprovou os dados, libera o cliente para rodar o firebase
  return {
    success: true,
    message: "dados validados no servidor!"
  };
}