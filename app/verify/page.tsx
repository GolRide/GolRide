"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function VerifyPage() {
  const router = useRouter();
  const sp = useSearchParams();
  const nextUrl = sp.get("next") || "";

  const email = useMemo(() => {
    const e = sp.get("email") || "";
    return e.trim().toLowerCase();
  }, [sp]);

  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code, next: nextUrl }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setMsg(data?.error || "Error verificando el código");
        return;
      }

      setMsg("Email verificado ✅ Redirigiendo...");
      const dest = nextUrl ? `/login?next=${encodeURIComponent(nextUrl)}` : "/login";
      router.replace(dest);
      router.refresh();
    } catch {
      setMsg("Error de red");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-md px-4 py-10">
      <h1 className="text-2xl font-semibold">Introduce tu código</h1>
      <p className="text-sm text-zinc-600 mt-2">
        Te hemos enviado un código al correo:
        <span className="font-medium"> {email || "(sin email)"}</span>
      </p>

      <form onSubmit={onSubmit} className="mt-6 grid gap-3">
        <input
          className="rounded-xl border px-3 py-2 text-center text-lg tracking-[0.35em]"
          placeholder="123456"
          value={code}
          onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
          inputMode="numeric"
          autoFocus
          required
        />

        <button
          className="rounded-xl bg-black text-white px-4 py-2 disabled:opacity-60"
          disabled={loading || !email || code.length !== 6}
        >
          {loading ? "Verificando..." : "Verificar"}
        </button>

        {msg && <p className="text-sm">{msg}</p>}
      </form>
    </div>
  );
}
