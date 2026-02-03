"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function ResetPasswordPage() {
  const router = useRouter();
  const sp = useSearchParams();

  const email = useMemo(() => (sp.get("email") || "").trim().toLowerCase(), [sp]);
  const token = useMemo(() => (sp.get("token") || "").trim(), [sp]);

  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/password-reset/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, token, password, password2 }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setMsg(data?.error || "Error");
        return;
      }

      setMsg("Contraseña actualizada ✅");
      router.replace("/login");
      router.refresh();
    } catch {
      setMsg("Error de red");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-md px-4 py-10">
      <h1 className="text-2xl font-semibold">Restablecer contraseña</h1>
      <p className="text-sm text-zinc-600 mt-2">
        Introduce tu nueva contraseña.
      </p>

      <form onSubmit={onSubmit} className="mt-6 grid gap-3">
        <input
          className="rounded-xl border px-3 py-2"
          placeholder="Nueva contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          required
        />
        <input
          className="rounded-xl border px-3 py-2"
          placeholder="Repite nueva contraseña"
          value={password2}
          onChange={(e) => setPassword2(e.target.value)}
          type="password"
          required
        />

        <button
          className="rounded-xl bg-black text-white px-4 py-2 disabled:opacity-60"
          disabled={loading || !email || !token}
        >
          {loading ? "Guardando..." : "Restablecer"}
        </button>

        {msg && <p className="text-sm">{msg}</p>}
      </form>
    </div>
  );
}
