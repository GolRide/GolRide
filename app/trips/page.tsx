import { headers } from "next/headers";
import { Page } from "@/components/ui/Page";
import { ButtonLink } from "@/components/ui/Button";
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

async function getTrips(params: Record<string, string>): Promise<Trip[]> {
  const h = headers();
  const host = h.get("host");
  const proto = process.env.NODE_ENV === "development" ? "http" : "https";
  const qs = new URLSearchParams(params).toString();
  const res = await fetch(`${proto}://${host}/api/trips?${qs}`, { cache: "no-store" });
  const data = await res.json();
  return data.trips || [];
}

export default async function TripsPage({ searchParams }: { searchParams: Record<string, string | string[] | undefined> }) {
  const params: Record<string, string> = {};
  for (const key of ["origin", "destination", "date", "team"]) {
    const value = searchParams?.[key];
    if (typeof value === "string" && value.trim()) {
      params[key] = value.trim();
    }
  }

  const trips = await getTrips(params);

  return (
    <Page>
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-2xl font-black tracking-tight text-slate-900">Viajes</h1>
        <ButtonLink href="/trips/new" variant="primary" className="w-auto">
          Publicar viaje
        </ButtonLink>
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

        {trips.length === 0 && (
          <div className="mt-3 text-slate-600">No hay viajes todavía.</div>
        )}
      </div>
    </Page>
  );
}
