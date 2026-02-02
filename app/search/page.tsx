import { headers } from "next/headers";
import { Page } from "@/components/ui/Page";
import { TripInfoCard } from "@/components/trips/TripInfoCard";

type Trip = {
  _id: string;
  origin: string;
  destination: string;
  date: string;
  time?: string;
  match: string;
  team: string;
  meetingPoint?: string;
  seatsAvailable: number;
  seatsTotal: number;
  priceCents: number;
  creator: { username?: string; avatar?: string };
};

async function getResults(params: Record<string, string>): Promise<Trip[]> {
  const h = headers();
  const host = h.get("host");
  const proto = process.env.NODE_ENV === "development" ? "http" : "https";

  const qs = new URLSearchParams(params).toString();
  const res = await fetch(`${proto}://${host}/api/trips?${qs}`, { cache: "no-store" });
  const data = await res.json();
  return data.trips || [];
}

export default async function SearchPage({ searchParams }: { searchParams: any }) {
  const origin = String(searchParams?.origin || "").trim();
  const destination = String(searchParams?.destination || "").trim();
  const team = String(searchParams?.team || "").trim();
  const date = String(searchParams?.date || "").trim();

  // Si faltan campos, no mostramos resultados
  const missing = !origin && !destination && !team && !date;
  const trips = missing ? [] : await getResults({ origin, destination, team, date });

  return (
    <Page>
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900">Resultados</h1>
          <p className="mt-1 text-sm text-slate-600">
            {missing
              ? "Completa el buscador en la página principal para ver resultados."
              : `Mostrando viajes para: ${origin} → ${destination} · ${team} · ${date}`}
          </p>
        </div>
        <a href="/" className="text-sm font-black text-slate-900 underline">
          Volver
        </a>
      </div>

      <div className="mt-4 grid gap-3">
        {trips.map((t) => (
          <TripInfoCard
            key={t._id}
            href={`/trips/${t._id}`}
            trip={{
              id: t._id,
              origin: t.origin,
              destination: t.destination,
              meetingPoint: t.meetingPoint || "",
              date: t.date,
              time: t.time,
              match: t.match,
              team: t.team,
              seatsAvailable: t.seatsAvailable,
              seatsTotal: t.seatsTotal,
              priceCents: t.priceCents,
              creatorName: t.creator?.username || "Usuario",
            }}
          />
        ))}

        {!missing && trips.length === 0 && (
          <div className="mt-3 text-slate-600">No hay viajes con esos criterios.</div>
        )}
      </div>
    </Page>
  );
}
