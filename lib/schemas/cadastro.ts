import z from "zod";

// schema com as regras de validacao do formulario
// regras de validacao do form - unica fonte da verdade
export const cadastroSchema = z.object({
  nome: z.string()
    .min(2, "nome precisa ter pelo menos 2 caracteres")
    .max(50, "nome muito grande"),

  email: z.string()
    .email("e-mail invalido")
    .trim()
    .toLowerCase(),

  senha: z.string()
    .min(8, "senha precisa ter pelo menos 8 caracteres")
    .regex(/[A-Z]/, "precisa ter pelo menos uma letra maiuscula")
    .regex(/[0-9]/, "precisa ter pelo menos um numero")
});

// cria automaticamente o type baseado no schema
export type CadastroInput = z.infer<typeof cadastroSchema>;