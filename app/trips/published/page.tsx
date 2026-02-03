"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

export default function PublishedPage({ searchParams }: { searchParams: Record<string, string | string[] | undefined> }) {
  const id = String(searchParams.id || "");
  const [copied, setCopied] = useState(false);

  const tripUrl = useMemo(() => {
    if (!id) return "";
    if (typeof window === "undefined") return "";
    return `${window.location.origin}/trips/${id}`;
  }, [id]);

  const waUrl = useMemo(() => {
    if (!tripUrl) return "";
    const text = encodeURIComponent(`¡Ya está publicado! Aquí tienes el viaje: ${tripUrl}`);
    return `https://wa.me/?text=${text}`;
  }, [tripUrl]);

  async function copy() {
    try {
      await navigator.clipboard.writeText(tripUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {}
  }

  return (
    <main className="min-h-[calc(100vh-64px)] bg-slate-50 text-slate-900">
      <div className="mx-auto w-full max-w-3xl px-4 py-10">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="text-2xl font-black tracking-tight">Viaje publicado</div>
          <div className="mt-1 text-sm font-bold text-slate-600">
            Copia el enlace o compártelo por WhatsApp.
          </div>

          {!id ? (
            <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-4 text-slate-700">
              Falta el ID del viaje.
            </div>
          ) : (
            <>
              <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-4">
                <div className="text-xs font-extrabold text-slate-500">ENLACE</div>
                <div className="mt-1 break-all text-sm font-bold text-slate-900">{tripUrl}</div>
              </div>

              <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                <button
                  onClick={copy}
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 font-extrabold text-slate-900 hover:bg-slate-50"
                >
                  {copied ? "Copiado ✅" : "Copiar enlace"}
                </button>

                <a
                  href={waUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full rounded-xl bg-slate-900 px-4 py-3 text-center font-extrabold text-white hover:bg-slate-800"
                >
                  Compartir en WhatsApp
                </a>
              </div>

              <div className="mt-5 flex flex-col gap-2 sm:flex-row">
                <Link
                  href={`/trips/${id}`}
                  className="inline-flex w-full items-center justify-center rounded-xl border border-slate-300 bg-white px-4 py-2 font-extrabold text-slate-900 hover:bg-slate-50"
                >
                  Ver viaje
                </Link>
                <Link
                  href="/"
                  className="inline-flex w-full items-center justify-center rounded-xl border border-slate-300 bg-white px-4 py-2 font-extrabold text-slate-900 hover:bg-slate-50"
                >
                  Volver al inicio
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
