// refeicao.ts
import z from "zod";

// schema com as regras de validacao do formulario
// regras de validacao do form - unica fonte da verdade
export const refeicaoSchema = z.object({
  descricao: z.string().min(3, "descrição muito curta"),
  calorias: z.number().min(1, "calorias devem ser maiores que zero"), 
  tipoRefeicao: z.enum(["café", "almoço", "lanche", "jantar", "ceia"]),
});

// cria o tipo baseado no esquema pra usar no formulário
export type RefeicaoInput = z.infer<typeof refeicaoSchema>;