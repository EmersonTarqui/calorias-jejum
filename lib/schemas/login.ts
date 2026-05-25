import z from "zod";

// schema com as regras de validacao do formulario
// regras de validacao do form - unica fonte da verdade
export const loginSchema = z.object({
  email: z.string()
    .email("e-mail invalido")
    .trim()
    .toLowerCase(),

  senha: z.string()
    .min(1, "senha obrigatoria")
});

// cria automaticamente o type baseado no schema
export type LoginInput = z.infer<typeof loginSchema>;