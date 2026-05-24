"use client"

import { startTransition, useActionState } from "react"
import { cadastrarAction, CadastroState } from "../actions/cadastrar"
import { useForm } from "react-hook-form"
import { CadastroInput, cadastroSchema } from "@/lib/schemas/cadastro"
import { zodResolver } from "@hookform/resolvers/zod"

// estado inicial antes da action rodar
const estadoInicial: CadastroState = { success: false }

export function CadastroForm() {
  // conecta com a server action e retorna:
  // estado do servidor, action do Form e se esta pendente
  const [estadoServidor, formAction, isPending] = useActionState(
    cadastrarAction,
    estadoInicial
  )

  const form = useForm<CadastroInput>({
    // usa o schema do zod para validar os campos
    resolver: zodResolver(cadastroSchema),
    // valores iniciais dos inputs
    defaultValues: { nome: "", email: "", senha: "" },
    // faz a validacao quando o usuario sai do campo
    mode: "onBlur"
  })

  function onSubmit(data: CadastroInput) {
    // cria um FormData para enviar os dados do formulario
    const formData = new FormData();

    // transforma o objeto em [key, value]
    // ex: { nome: "Emerson" } => [["nome", "Emerson"]]
    Object.entries(data).forEach(([k, v]) =>
      // percorre cada campo e adiciona no FormData
      formData.append(k, v)
    );
    
    // executa o envio sem travar a interface
    startTransition(() => {
      formAction(formData)
    })
  }

  // classes reutilizáveis para todos os inputs
  // inclui estilos do modo claro e escuro
  const inputClasses = "w-full rounded border border-gray-300 px-3 py-2 text-black placeholder:text-gray-400 focus:border-black focus:ring-1 focus:ring-black dark:border-gray-700 dark:bg-zinc-900 dark:text-white dark:placeholder:text-gray-500 dark:focus:border-white dark:focus:ring-white";

  // classes padrão dos labels
  // muda a cor no modo escuro
  const labelClasses = "block text-sm font-medium text-gray-700 dark:text-gray-300";

  return (
    <form action={formAction} onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      {/* campo nome */}
      <div className="space-y-1">
        <label htmlFor="nome" className={labelClasses}>nome</label>
        <input
          id="nome"
          type="text"
          placeholder="seu nome"
          {...form.register("nome")}
          className={inputClasses}
        />
        {/* mostra erro de validação do react-hook-form/zod */}
        {form.formState.errors.nome && (
          <p className="text-sm text-red-600 dark:text-red-500">{form.formState.errors.nome.message}</p>
        )}
      </div>

      {/* campo email */}
      <div className="space-y-1">
        <label htmlFor="email" className={labelClasses}>email</label>
        <input
          id="email"
          type="email"
          placeholder="email@exemplo.com"
          {...form.register("email")}
          className={inputClasses}
        />
        {/* mostra erro de validação do react-hook-form/zod */}
        {form.formState.errors.email && (
          <p className="text-sm text-red-600 dark:text-red-500">{form.formState.errors.email.message}</p>
        )}
        {/* mostra erro vindo do servidor (regra de negócio) */}
        {estadoServidor.erros?.email && (
          <p className="text-sm text-red-600 dark:text-red-500">{estadoServidor.erros.email[0]}</p>
        )}
      </div>

      {/* campo senha */}
      <div className="space-y-1">
        <label htmlFor="senha" className={labelClasses}>senha</label>
        <input
          id="senha"
          type="password"
          {...form.register("senha")}
          className={inputClasses}
        />
        {/* mostra erro de validação do react-hook-form/zod */}
        {form.formState.errors.senha && (
          <p className="text-sm text-red-600 dark:text-red-500">{form.formState.errors.senha.message}</p>
        )}
      </div>

      {/* mensagem de sucesso servidor */}
      {estadoServidor.success && (
        <p className="text-sm text-green-600 dark:text-green-500">{estadoServidor.message}</p>
      )}

      {/* botao enviar do form*/}
      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded bg-black px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-zinc-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black disabled:opacity-50 dark:bg-white dark:text-black dark:hover:bg-zinc-200 dark:focus-visible:outline-white"
      >
        {/* muda o texto enquanto a requisição está carregando */}
        {isPending ? "cadastrando..." : "cadastrar"}
      </button>
    </form>
  )
}