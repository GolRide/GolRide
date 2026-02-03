"use client";

import { useRouter, useSearchParams } from "next/navigation";

export default function UpdateSuccessModal() {
  const router = useRouter();
  const sp = useSearchParams();

  const updated = sp.get("updated") === "1";
  const deleted = sp.get("deleted") === "1";

  if (!updated && !deleted) return null;

  const title = updated ? "✅ Viaje actualizado" : "🗑️ Viaje eliminado";
  const message = updated
    ? "Tu viaje se ha modificado con éxito."
    : "Tu viaje se ha eliminado con éxito.";

  const onAccept = () => {
    router.replace("/dashboard/active-trips");
    router.refresh();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl border">
        <h2 className="text-xl font-black tracking-tight">{title}</h2>
        <p className="mt-2 text-slate-600">{message}</p>

        <button
          onClick={onAccept}
          className="mt-5 w-full rounded-xl bg-black px-4 py-3 font-bold text-white hover:opacity-90"
        >
          Aceptar
        </button>
      </div>
    </div>
  );
}
