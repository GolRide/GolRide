"use client";

import { useMemo, useState } from "react";

export default function ContactOrganizerModal({
  phone,
  email,
}: {
  phone?: string;
  email?: string;
}) {
  const [open, setOpen] = useState(false);

  const phoneText = (phone || "").trim() || "No disponible";
  const emailText = (email || "").trim() || "No disponible";

  const { canWhatsApp, whatsappHref } = useMemo(() => {
    const rawDigits = (phone || "").replace(/\D/g, "");
    // España automático: si son 9 dígitos, asumimos ES y anteponemos 34
    const whatsappPhone = rawDigits.length === 9 ? `34${rawDigits}` : rawDigits;

    const ok = whatsappPhone.length >= 11; // 34 + 9 dígitos = 11
    const defaultMessage =
      "Hola, he reservado contigo una plaza para el partido. ¿Podemos confirmar punto de encuentro y hora? ¡Gracias!";

    const href = ok
      ? `https://wa.me/${whatsappPhone}?text=${encodeURIComponent(defaultMessage)}`
      : "";

    return { canWhatsApp: ok, whatsappHref: href };
  }, [phone]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-xl bg-black text-white px-4 py-2 font-extrabold hover:opacity-90"
      >
        Contacta con el organizador
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />

          <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-lg">
            <div className="text-lg font-extrabold text-slate-900">Contacto del organizador</div>

            <div className="mt-4 space-y-3 text-sm">
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                <div className="text-xs font-black text-slate-500">Teléfono</div>

                <div className="mt-1 flex items-center justify-between gap-3">
                  <div className="font-extrabold text-slate-900">{phoneText}</div>

                  <a
                    href={whatsappHref}
                    target="_blank"
                    rel="noreferrer"
                    className={
                      canWhatsApp
                        ? "inline-flex items-center rounded-lg bg-emerald-500 px-3 py-1.5 text-xs font-extrabold text-white hover:bg-emerald-600"
                        : "inline-flex items-center rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-extrabold text-slate-400 cursor-not-allowed"
                    }
                    aria-disabled={!canWhatsApp}
                    onClick={(e) => {
                      if (!canWhatsApp) e.preventDefault();
                    }}
                  >
                    WhatsApp
                  </a>
                </div>
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                <div className="text-xs font-black text-slate-500">Email</div>
                <div className="mt-1 font-extrabold text-slate-900">{emailText}</div>
              </div>
            </div>

            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-xl border border-slate-300 bg-white px-4 py-2 font-extrabold text-slate-700 hover:bg-slate-50"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
