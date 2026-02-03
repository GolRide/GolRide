"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const BASE_CATEGORIES = [
  "Juvenil",
  "Cadete",
  "Infantil",
  "Alevín",
  "Benjamín",
  "Prebenjamín",
  "Bebé",
];

export default function EditTripPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [err, setErr] = useState<string>("");

  const [form, setForm] = useState<any>({
    origin: "",
    destination: "",
    date: "",
    time: "",
    meetingPoint: "",
    match: "",
    team: "",
    seatsTotal: 1,
    priceEuros: "0", // 👈 mostrar en euros
    contactPreference: "whatsapp",
    active: true,
    isBase: false,
    baseCategory: BASE_CATEGORIES[0],
  });

  useEffect(() => {
    (async () => {
      const res = await fetch(`/api/trips/${params.id}`, { cache: "no-store" });
      const data = await res.json().catch(() => null);

      if (!res.ok || !data?.trip) {
        setErr("No se pudo cargar el viaje");
        setLoading(false);
        return;
      }

      const t = data.trip;

      // date -> yyyy-mm-dd
      const d = new Date(t.date);
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, "0");
      const dd = String(d.getDate()).padStart(2, "0");

      const euros = ((Number(t.priceCents ?? 0)) / 100).toFixed(2);

      setForm({
        origin: t.origin ?? "",
        destination: t.destination ?? "",
        date: `${yyyy}-${mm}-${dd}`,
        time: t.time ?? "",
        meetingPoint: t.meetingPoint ?? "",
        match: t.match ?? "",
        team: t.team ?? "",
        seatsTotal: t.seatsTotal ?? 1,
        priceEuros: euros,
        contactPreference: t.contactPreference ?? "whatsapp",
        active: t.active ?? true,
        isBase: Boolean(t.isBase),
        baseCategory: t.baseCategory ?? BASE_CATEGORIES[0],
      });

      setLoading(false);
    })();
  }, [params.id]);

  const onChange = (k: string, v: any) => setForm((s: any) => ({ ...s, [k]: v }));

  const onSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr("");
    setSaving(true);

    // euros -> cents
    const eurosNum = Number(String(form.priceEuros).replace(",", "."));
    const priceCents = Number.isFinite(eurosNum) ? Math.round(eurosNum * 100) : 0;

    const payload: any = {
      origin: form.origin,
      destination: form.destination,
      date: new Date(form.date).toISOString(),
      time: form.time,
      meetingPoint: form.meetingPoint,
      match: form.match,
      team: form.team,
      seatsTotal: Number(form.seatsTotal),
      priceCents,
      contactPreference: form.contactPreference,
      active: Boolean(form.active),
      isBase: Boolean(form.isBase),
      baseCategory: form.isBase ? form.baseCategory : null,
    };

    const res = await fetch(`/api/trips/${params.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setErr(data?.error || "Error guardando");
      setSaving(false);
      return;
    }

    router.replace("/dashboard/active-trips?updated=1");
    router.refresh();
  };

  const onDelete = async () => {
    const ok = window.confirm("Vas a eliminar tu viaje. ¿Estás seguro?");
    if (!ok) return;

    setErr("");
    setDeleting(true);

    const res = await fetch(`/api/trips/${params.id}`, { method: "DELETE" });
    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      setErr(data?.error || "Error eliminando");
      setDeleting(false);
      return;
    }

    router.push("/dashboard/active-trips");
  };

  if (loading) return <div className="p-6">Cargando...</div>;

  return (
    <main className="mx-auto max-w-2xl px-4 py-10">
      <div className="rounded-2xl border bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-black tracking-tight">Editar viaje</h1>

        {err ? (
          <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {err}
          </div>
        ) : null}

        <form onSubmit={onSave} className="mt-6 grid gap-4">
          <label className="text-sm font-bold">
            Origen
            <input className="mt-1 w-full rounded-xl border px-3 py-2" value={form.origin} onChange={(e)=>onChange("origin", e.target.value)} />
          </label>

          <label className="text-sm font-bold">
            Destino
            <input className="mt-1 w-full rounded-xl border px-3 py-2" value={form.destination} onChange={(e)=>onChange("destination", e.target.value)} />
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="text-sm font-bold">
              Fecha
              <input type="date" className="mt-1 w-full rounded-xl border px-3 py-2" value={form.date} onChange={(e)=>onChange("date", e.target.value)} />
            </label>

            <label className="text-sm font-bold">
              Hora
              <input type="time" className="mt-1 w-full rounded-xl border px-3 py-2" value={form.time} onChange={(e)=>onChange("time", e.target.value)} />
            </label>
          </div>

          <label className="text-sm font-bold">
            Punto de encuentro
            <input className="mt-1 w-full rounded-xl border px-3 py-2" value={form.meetingPoint} onChange={(e)=>onChange("meetingPoint", e.target.value)} />
          </label>

          <label className="text-sm font-bold">
            Equipo
            <input className="mt-1 w-full rounded-xl border px-3 py-2" value={form.team} onChange={(e)=>onChange("team", e.target.value)} />
          </label>

          <label className="text-sm font-bold">
            Partido
            <input className="mt-1 w-full rounded-xl border px-3 py-2" value={form.match} onChange={(e)=>onChange("match", e.target.value)} />
          </label>

          <div className="rounded-2xl border p-4">
            <div className="flex items-center gap-2">
              <input
                id="isBase"
                type="checkbox"
                className="h-4 w-4"
                checked={Boolean(form.isBase)}
                onChange={(e)=>onChange("isBase", e.target.checked)}
              />
              <label htmlFor="isBase" className="font-bold text-sm">¿El partido es fútbol base?</label>
            </div>

            {form.isBase ? (
              <div className="mt-3">
                <label className="text-sm font-bold">
                  Categoría
                  <select
                    className="mt-1 w-full rounded-xl border px-3 py-2"
                    value={form.baseCategory}
                    onChange={(e)=>onChange("baseCategory", e.target.value)}
                  >
                    {BASE_CATEGORIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </label>
              </div>
            ) : null}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="text-sm font-bold">
              Plazas
              <input type="number" min="1" className="mt-1 w-full rounded-xl border px-3 py-2" value={form.seatsTotal} onChange={(e)=>onChange("seatsTotal", e.target.value)} />
            </label>

            <label className="text-sm font-bold">
              Precio (€)
              <input
                type="text"
                inputMode="decimal"
                className="mt-1 w-full rounded-xl border px-3 py-2"
                value={form.priceEuros}
                onChange={(e)=>onChange("priceEuros", e.target.value)}
                placeholder="Ej: 10.00"
              />
            </label>
          </div>

          <label className="text-sm font-bold">
            Activo
            <select className="mt-1 w-full rounded-xl border px-3 py-2" value={form.active ? "1" : "0"} onChange={(e)=>onChange("active", e.target.value === "1")}>
              <option value="1">Sí</option>
              <option value="0">No</option>
            </select>
          </label>

          <button disabled={saving} className="rounded-xl bg-black text-white px-4 py-3 font-bold hover:opacity-90 disabled:opacity-50">
            {saving ? "Guardando..." : "Guardar cambios"}
          </button>
        </form>
      </div>
    </main>
  );
}
