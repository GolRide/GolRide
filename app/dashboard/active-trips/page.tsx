import Link from "next/link";
import { headers } from "next/headers";

type Trip = {
  _id: string;
  origin: string;
  destination: string;
  date: string;
  time?: string;
  match: string;
  team: string;
  seatsAvailable: number;
  seatsTotal: number;
  priceCents: number;
  creator: { username?: string; avatar?: string };
};

function formatDateES(iso: string) {
  try {
    return new Date(iso).toLocaleDateString("es-ES", { day: "2-digit", month: "short", year: "numeric" });
  } catch {
    return iso;
  }
}

async function getMyTrips(): Promise<Trip[]> {
  const h = headers();
  const host = h.get("host");
  const proto = process.env.NODE_ENV === "development" ? "http" : "https";

  const res = await fetch(`${proto}://${host}/api/trips?mine=1`, { cache: "no-store" });
  if (!res.ok) return [];
  const data = await res.json().catch(() => ({}));
  return data.trips || [];
}

export default async function ActiveTripsPage() {
  const trips = await getMyTrips();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-2xl font-black tracking-tight text-slate-900">Viajes activos</h1>
        <Link
          href="/trips/new"
          className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-4 py-2 font-extrabold text-slate-900 hover:bg-slate-50"
        >
          + Publicar viaje
        </Link>
      </div>

      {trips.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 text-slate-700 shadow-sm">
          Aún no has publicado viajes. Cuando publiques uno, aparecerá aquí.
        </div>
      ) : (
        <div className="grid gap-3">
          {trips.map((t) => (
            <Link
              key={t._id}
              href={`/trips/${t._id}`}
              className="block rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-slate-300"
            >
              <div className="flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <div className="text-sm font-extrabold text-slate-900">
                    {t.origin} → {t.destination}
                  </div>

                  <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-xs">
                    <span className="font-bold text-sky-700">
                      {formatDateES(t.date)}{t.time ? ` · ${t.time}` : ""}
                    </span>
                    <span className="font-bold text-indigo-700">{t.team}</span>
                    <span className="font-bold text-slate-700">{t.match}</span>
                  </div>

                  <div className="mt-2 text-xs text-slate-600">
                    Plazas: <span className="font-extrabold text-emerald-700">{t.seatsAvailable}</span> / {t.seatsTotal}
                  </div>
                </div>

                <div className="shrink-0 text-right">
                  <div className="inline-flex rounded-xl bg-slate-900 px-3 py-2 text-sm font-extrabold text-white">
                    {(t.priceCents / 100).toFixed(2)} €
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
