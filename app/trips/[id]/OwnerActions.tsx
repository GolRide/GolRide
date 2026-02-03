"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function OwnerActions({ tripId }: { tripId: string }) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  const onDelete = async () => {
    const ok = window.confirm("Vas a eliminar tu viaje. ¿Estás seguro?");
    if (!ok) return;

    setDeleting(true);
    const res = await fetch(`/api/trips/${tripId}`, { method: "DELETE" });
    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      alert(data?.error || "Error eliminando el viaje");
      setDeleting(false);
      return;
    }

    router.replace("/dashboard/active-trips?deleted=1");
    router.refresh();
  };

  return (
    <button
      onClick={onDelete}
      disabled={deleting}
      className="rounded-xl border border-red-300 bg-red-50 px-4 py-3 font-bold text-red-700 hover:bg-red-100 disabled:opacity-50"
    >
      {deleting ? "Eliminando..." : "Eliminar viaje"}
    </button>
  );
}
