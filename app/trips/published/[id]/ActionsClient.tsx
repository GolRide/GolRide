"use client";

export default function ActionsClient({ shareUrl }: { shareUrl: string }) {
  const onCopy = async () => {
    await navigator.clipboard.writeText(shareUrl);
    alert("✅ Enlace copiado");
  };

  const onWhatsApp = () => {
    const text = `¡He creado un viaje en GolRide! Únete aquí: ${shareUrl}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
  };

  return (
    <div className="flex gap-2">
      <button onClick={onCopy} className="rounded-xl border px-4 py-2 hover:bg-white">
        Copiar link
      </button>
      <button onClick={onWhatsApp} className="rounded-xl bg-green-600 text-white px-4 py-2 hover:opacity-90">
        Compartir WhatsApp
      </button>
    </div>
  );
}
