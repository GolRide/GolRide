"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/password-reset/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      await res.json().catch(() => ({}));
      setMsg("Si el email existe, te enviaremos un enlace para restablecer la contraseña.");
    } catch {
      setMsg("Error de red");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-md px-4 py-10">
      <h1 className="text-2xl font-semibold">¿Has olvidado tu contraseña?</h1>
      <p className="text-sm text-zinc-600 mt-2">
        Introduce tu email y te enviaremos un enlace para restablecerla.
      </p>

      <form onSubmit={onSubmit} className="mt-6 grid gap-3">
        <input
          className="rounded-xl border px-3 py-2"
          placeholder="tuemail@ejemplo.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          required
        />

        <button className="rounded-xl bg-black text-white px-4 py-2 disabled:opacity-60" disabled={loading}>
          {loading ? "Enviando..." : "Enviar enlace"}
        </button>

        {msg && <p className="text-sm">{msg}</p>}

        <button
          type="button"
          className="text-sm text-zinc-600 underline text-left"
          onClick={() => {
            router.replace("/login");
            router.refresh();
          }}
        >
          Volver a iniciar sesión
        </button>
      </form>
    </div>
  );
}
