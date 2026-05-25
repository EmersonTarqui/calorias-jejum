"use client"

import { useState } from "react"
import { sendPasswordResetEmail } from "firebase/auth"
import { auth } from "@/lib/firebase"

export function RecuperarForm() {
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")

  async function handleReset(e: React.FormEvent) {
    e.preventDefault()
    setStatus("loading")
    try {
      await sendPasswordResetEmail(auth, email)
      setStatus("success")
    } catch {
      setStatus("error")
    }
  }

  return (
    <form onSubmit={handleReset} className="space-y-4">
      <input
        type="email"
        placeholder="digite seu e-mail"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
      />
      <button 
        disabled={status === "loading"}
        className="w-full rounded bg-black py-2 text-white text-sm font-semibold disabled:opacity-50"
      >
        {status === "loading" ? "enviando..." : "enviar link de recuperação"}
      </button>
      {status === "success" && <p className="text-sm text-green-600">verifique sua caixa de entrada!</p>}
      {status === "error" && <p className="text-sm text-red-600">erro ao enviar e-mail.</p>}
    </form>
  )
}