"use server";

import { cadastroSchema } from "@/lib/schemas/cadastro";
import { auth } from "@/lib/firebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";

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

// server action de cadastro
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

  try {
    // cria usuario no firebase
    const userCredential = await createUserWithEmailAndPassword(
      auth, 
      resultado.data.email, 
      resultado.data.senha
    );

    // salva o nome no perfil do usuario
    await updateProfile(userCredential.user, {
      displayName: resultado.data.nome
    });

    return {
      success: true,
      message: "cadastro realizado com sucesso!"
    };
  } catch (error: any) {
    // trata erro de email ja existente
    if (error.code === "auth/email-already-in-use") {
      return {
        success: false,
        message: "erro no cadastro",
        erros: { email: ["este e-mail ja esta em uso."] }
      };
    }
    return {
      success: false,
      message: "falha ao comunicar com o servidor."
    };
  }
}