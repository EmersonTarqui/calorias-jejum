"use client"

import { startTransition, useActionState, useEffect, useState } from "react"
import { loginAction, LoginState } from "../../actions/login"
import { useForm } from "react-hook-form"
import { LoginInput, loginSchema } from "@/lib/schemas/login"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { signInWithEmailAndPassword } from "firebase/auth"
import { auth } from "@/lib/firebase"
import Link from "next/link"

// estado inicial antes da action rodar
const estadoInicial: LoginState = { success: false }

export function LoginForm() {
  // hook de navegacao do next.js
  const router = useRouter()

  const [verificandoAuth, setVerificandoAuth] = useState(true)

  // conecta com a server action e retorna:
  // estado do servidor, action do Form e se esta pendente
  const [estadoServidor, formAction, isPendingAction] = useActionState(
    loginAction,
    estadoInicial
  )

  // estados locais para controlar o firebase no cliente
  const [isAuthPending, setIsAuthPending] = useState(false)
  const [mensagemFirebase, setMensagemFirebase] = useState("")
  const [sucessoFinal, setSucessoFinal] = useState(false)

  const form = useForm<LoginInput>({
    // usa o schema do zod para validar os campos
    resolver: zodResolver(loginSchema),
    // valores iniciais dos inputs
    defaultValues: { email: "", senha: "" },
    // faz a validacao quando o usuario sai do campo
    mode: "onBlur"
  })

  // escuta o estado de autenticacao e redireciona
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        router.push("/dashboard")
      } else {
        setVerificandoAuth(false)
      }
    })
    return () => unsubscribe()
  }, [router])

  // escuta as mudancas do servidor para fazer o login no firebase
  useEffect(() => {
    async function logarNoFirebase() {
      // se a action deu sucesso, ainda n finalizou e n ta carregando o auth
      if (estadoServidor.success && !sucessoFinal && !isAuthPending) {
        setIsAuthPending(true)
        const valores = form.getValues()

        try {
          // autentica no cliente para manter a sessao salva no navegador
          await signInWithEmailAndPassword(auth, valores.email, valores.senha)
          
          setSucessoFinal(true)
          setMensagemFirebase("login realizado com sucesso! redirecionando...")

          // redireciona para o dashboard após 1,5 segundos
          const timer = setTimeout(() => {
            router.push("/dashboard")
          }, 1500)
          
          // cancela o tempo se sair da tela antes
          return () => clearTimeout(timer)

        } catch (erro) {
          // trata erro de credenciais incorretas ou usuario inexistente
          setMensagemFirebase("e-mail ou senha incorretos.")
        } finally {
          setIsAuthPending(false)
        }
      }
    }
    logarNoFirebase()
  }, [estadoServidor.success, form, router, sucessoFinal, isAuthPending])

  // Verifica o estado de Auth antes de renderizar qualquer coisa - MOVIDO PARA O FINAL
  if (verificandoAuth) return null

  function onSubmit(data: LoginInput) {
    setMensagemFirebase("")
    
    // cria um FormData para enviar os dados do formulario
    const formData = new FormData();

    // transforma o objeto em [key, value]
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

  // bloqueia o botao se a action ou o firebase estiverem rodando
  const isCarregando = isPendingAction || isAuthPending

  return (
    <form action={formAction} onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      
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

      {/* mensagem de sucesso final ou erro do firebase */}
      {sucessoFinal && (
        <p className="text-sm text-green-600 dark:text-green-500">{mensagemFirebase}</p>
      )}
      {mensagemFirebase && !sucessoFinal && (
        <p className="text-sm text-red-600 dark:text-red-500">{mensagemFirebase}</p>
      )}

      {/* botao enviar do form */}
      <button
        type="submit"
        disabled={isCarregando || sucessoFinal}
        className="w-full rounded bg-black px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-zinc-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black disabled:opacity-50 dark:bg-white dark:text-black dark:hover:bg-zinc-200 dark:focus-visible:outline-white"
      >
        {/* muda o texto de acordo com o estado atual */}
        {isCarregando ? "entrando..." : sucessoFinal ? "redirecionando..." : "entrar"}
      </button>

      {/* Link para recuperação de senha */}
      <div className="mt-4 text-center">
        <Link 
          href="/recuperar-senha" 
          className="text-sm text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white"
        >
          Esqueceu a senha?
        </Link>
      </div>
    </form>
  )
}