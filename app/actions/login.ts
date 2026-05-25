"use server";

import { loginSchema } from "@/lib/schemas/login";

// define o formato do estado retornado pela action
export type LoginState = {
  success: boolean;
  message?: string;
  erros?: {
    email?: string[];
    senha?: string[];
  };
};

// server action de login focada apenas na validacao de seguranca
export async function loginAction(
  _prevState: LoginState,
  formData: FormData
): Promise<LoginState> {
  // converte o FormData em objeto
  const dados = Object.fromEntries(formData);
  
  // valida os dados usando o schema do zod
  const resultado = loginSchema.safeParse(dados);

  if (!resultado.success) {
    return {
      success: false,
      message: "dados invalidos",
      erros: resultado.error.flatten().fieldErrors,
    };
  }

  // servidor aprovou os dados, libera o cliente para logar
  return {
    success: true,
    message: "dados validados no servidor!"
  };
}