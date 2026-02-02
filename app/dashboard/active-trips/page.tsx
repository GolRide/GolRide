import Link from "next/link";
import { headers } from "next/headers";
import { TripInfoCard } from "@/components/trips/TripInfoCard";
import { getDepartureDate, sortTripsByDeparture } from "@/lib/trips";

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
  const now = new Date();
  const upcoming = trips.filter((t) => getDepartureDate({ date: t.date, time: t.time }) >= now);
  upcoming.sort(sortTripsByDeparture);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-2xl font-black tracking-tight text-slate-900">Viajes activos</h1>
        <Link
          href="/trips/new"
          className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2 font-extrabold text-slate-900 hover:bg-slate-50"
        >
          + Publicar viaje
        </Link>
      </div>

      {upcoming.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 text-slate-700 shadow-sm">
          Aún no has publicado viajes. Cuando publiques uno, aparecerá aquí.
        </div>
      ) : (
        <div className="grid gap-3">
          {upcoming.map((t) => (
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
        </div>
      )}
    </div>
  );
}
