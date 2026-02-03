"use client";



import { Page } from "@/components/ui/Page";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

const styles: Record<string, React.CSSProperties> = {
  page: { padding: 24, fontFamily: "system-ui" },
  container: { maxWidth: 860, margin: "0 auto" },
  title: { margin: 0, fontSize: 28, fontWeight: 800 },
  subtitle: { margin: "6px 0 14px", color: "#475569", fontSize: 14 },
  card: {
    background: "#fff",
    border: "1px solid #e2e8f0",
    borderRadius: 16,
    padding: 18,
    boxShadow: "0 8px 24px rgba(2,6,23,0.06)",
  },
  grid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 },
  full: { gridColumn: "1 / -1" },
  label: { display: "block", fontSize: 12, fontWeight: 700, marginBottom: 6 },
  input: {
    width: "100%",
    padding: "12px",
    borderRadius: 12,
    border: "1px solid #cbd5e1",
    fontSize: 14,
  },
  row: { display: "flex", alignItems: "center", gap: 8, marginTop: 10 },
  checkbox: { width: 18, height: 18 },
  button: {
    marginTop: 16,
    padding: "12px 16px",
    borderRadius: 12,
    border: "1px solid #0f172a",
    background: "#0f172a",
    color: "#fff",
    fontWeight: 800,
    cursor: "pointer",
  },
};

const BASE_CATEGORIES = [
  "Juvenil",
  "Cadete",
  "Infantil",
  "Alevín",
  "Benjamín",
  "Prebenjamín",
  "Bebé",
];

export default function NewTripPage() {
  const router = useRouter();
  const [isBase, setIsBase] = useState(false);
  const [matchHome, setMatchHome] = useState("");
  const [matchAway, setMatchAway] = useState("");
  const [errorMsg, setErrorMsg] = useState<string>("");

  const submitIdRef = useRef<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const todayStr = new Date().toISOString().split("T")[0];

  const [form, setForm] = useState({
    origin: "",
    destination: "",
    date: "",
    time: "",
    meetingPoint: "",
    match: "",
    team: "",
    seatsTotal: 1,
    priceCents: 0,
    contactPreference: "whatsapp",
    transport: "coche",
    baseCategory: BASE_CATEGORIES[0],
  });

  async function onSubmit(e: React.FormEvent) {
    setErrorMsg("");
    e.preventDefault();


    // idempotencia: si se dispara el submit 2 veces, usamos el mismo id
    if (!submitIdRef.current) {
      submitIdRef.current = (globalThis.crypto && typeof crypto.randomUUID === "function")
        ? crypto.randomUUID()
        : String(Date.now()) + "-" + Math.random();
    }
    const clientRequestId = submitIdRef.current;
    const payload = {
      clientRequestId,
      ...form,
      isBase,
      baseCategory: isBase ? form.baseCategory : null,
    };

    const res = await fetch("/api/trips", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.status === 401) {
      router.push("/login?next=/trips/new");
      return;
    }

    const data = await res.json();

    if (!res.ok) {
      if (data?.error === "date_in_past") {
        setErrorMsg("❌ La fecha no puede ser anterior a hoy");
        return;
      }
      setErrorMsg("❌ Error creando el viaje");
      return;
    }

    submitIdRef.current = null;
      router.push(`/trips/published/${data.id}`);
  }

  return (
    <Page>
      <main style={styles.page}>
      <div style={styles.container}>
        <h1 style={styles.title}>Publicar viaje</h1>
        <p style={styles.subtitle}>Rellena los datos y publícalo.</p>

        <section style={styles.card}>
          <form onSubmit={onSubmit}>
            <div style={styles.grid}>
              <div>
                <label style={styles.label}>Origen</label>
                <input
                  style={styles.input}
                  placeholder="Ej: Zaragoza"
                  value={form.origin}
                  onChange={(e)=>setForm({...form, origin:e.target.value})}
                />
              </div>

              <div>
                <label style={styles.label}>Destino</label>
                <input
                  style={styles.input}
                  placeholder="Ej: Vigo"
                  value={form.destination}
                  onChange={(e)=>setForm({...form, destination:e.target.value})}
                />
              </div>

              <div>
                <label style={styles.label}>Fecha</label>
                <input
                  type="date"
                  min={todayStr}
                  style={styles.input}
                  value={form.date}
                  onChange={(e)=>setForm({...form, date:e.target.value})}
                />
              </div>

              <div>
                <label style={styles.label}>Hora</label>
                <input
                  required
                  type="time"
                  style={styles.input}
                  value={form.time}
                  onChange={(e)=>setForm({...form, time:e.target.value})}
                />
              </div>

              <div>
                <label style={styles.label}>Plazas disponibles</label>
                <input
                  type="number"
                  min={1}
                  max={60}
                  style={styles.input}
                  value={form.seatsTotal}
                  onChange={(e)=>setForm({...form, seatsTotal:Number(e.target.value)})}
                />
              </div>

              <div style={styles.full}>
                <label style={styles.label}>Equipo</label>
                <input
                  style={styles.input}
                  placeholder="Ej: Valencia CF"
                  value={form.team}
                  onChange={(e)=>setForm({...form, team:e.target.value})}
                />
              </div>

              <div style={styles.full}>
  <label style={styles.label}>Partido</label>
  <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
    <input
      style={styles.input}
      placeholder="Ej: Málaga CF"
      value={matchHome}
      onChange={(e)=>{
        const v = e.target.value;
        setMatchHome(v);
        setForm({...form, match: v + " vs " + matchAway});
      }}
    />
    <span style={{ fontWeight: 800, opacity: 0.7, padding: "0 2px" }}>vs</span>
    <input
      style={styles.input}
      placeholder="Ej: UD Almeria"
      value={matchAway}
      onChange={(e)=>{
        const v = e.target.value;
        setMatchAway(v);
        setForm({...form, match: matchHome + " vs " + v});
      }}
    />
  </div>

  <div style={{ ...styles.row, marginTop: 10 }}>
    <input
      type="checkbox"
      style={styles.checkbox}
      checked={isBase}
      onChange={(e)=>setIsBase(e.target.checked)}
    />
    <span>¿Tu partido es fútbol base?</span>
  </div>

  {isBase && (
    <select
      style={{...styles.input, marginTop:8}}
      value={form.baseCategory}
      onChange={(e)=>setForm({...form, baseCategory:e.target.value})}
    >
      {BASE_CATEGORIES.map(c => (
        <option key={c} value={c}>{c}</option>
      ))}
    </select>
  )}
</div>

<div style={styles.full}>
  <label style={styles.label}>Punto de encuentro (opcional)</label>
  <input
    style={styles.input}
    placeholder="Ej: Parking del estadio, Puerta 3"
    value={form.meetingPoint}
    onChange={(e)=>setForm({...form, meetingPoint:e.target.value})}
  />
  <div style={{ marginTop: 6, fontSize: 12, opacity: 0.75 }}>
    Si aún no lo tienes claro, podéis acordarlo por el método de contacto elegido.
  </div>
</div>

              <div>
                <label style={styles.label}>Precio €/plaza</label>
                <input
                  type="number"
                  style={styles.input}
                  value={(form.priceCents/100).toFixed(2)}
                  onChange={(e)=>setForm({...form, priceCents:Math.round(Number(e.target.value)*100)})}
                />
              </div>

              <div>
                <label style={styles.label}>Transporte</label>
                <select
                  style={styles.input}
                  value={form.transport}
                  onChange={(e)=>setForm({...form, transport:e.target.value})}
                >
                  <option value="bus">Bus</option>
                  <option value="coche">Coche</option>
                  <option value="otro">Otro</option>
                </select>
              </div>
            </div>

            <button type="submit" style={styles.button} disabled={isSubmitting}>Publicar viaje</button>
          {errorMsg && <div style={{ marginTop: 12, color: "#b91c1c", fontWeight: 700 }}>{errorMsg}</div>}
          </form>
        </section>
      </div>
    </main>
    </Page>
  );
}
