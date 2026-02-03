"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function ReservedSuccessModal() {
  const router = useRouter();
  const sp = useSearchParams();
  const reserved = sp.get("reserved") === "1";

  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (reserved) setOpen(true);
  }, [reserved]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      {/* overlay */}
      <div
        className="absolute inset-0 bg-black/40"
        onClick={() => {
          setOpen(false);
          router.replace("/dashboard/profile");
          router.refresh();
        }}
      />

      {/* modal */}
      <div className="relative w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-xl">
        <div className="text-xl font-black text-slate-900">Enhorabuena</div>
        <p className="mt-2 text-slate-600">
          Has reservado tu plaza.
        </p>

        <button
          className="mt-6 w-full rounded-xl bg-black px-4 py-3 font-bold text-white hover:opacity-90"
          onClick={() => {
            setOpen(false);
            router.replace("/dashboard/profile");
            router.refresh();
          }}
        >
          Aceptar
        </button>
      </div>
    </div>
  );
}
