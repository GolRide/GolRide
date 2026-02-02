import { dbConnect } from "@/lib/db";
import { Trip } from "@/models/Trip";
import User from "@/models/User";
import { TripCard } from "@/components/TripCard";

function fmtDate(d: Date) {
  return new Intl.DateTimeFormat("es-ES", { dateStyle: "medium" }).format(d);
}
function fmtPrice(cents: number) {
  return new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" }).format(cents / 100);
}

export async function TripsGrid({ searchParams }: { searchParams: Record<string, any> }) {
  await dbConnect();

  const origin = typeof searchParams.origin === "string" ? searchParams.origin.trim() : "";
  const destination = typeof searchParams.destination === "string" ? searchParams.destination.trim() : "";
  const date = typeof searchParams.date === "string" ? searchParams.date : "";
  const team = typeof searchParams.team === "string" ? searchParams.team.trim() : "";

  const q: any = { active: true };
  if (origin) q.origin = new RegExp(origin, "i");
  if (destination) q.destination = new RegExp(destination, "i");
  if (team) q.team = new RegExp(team, "i");
  if (date) {
    const start = new Date(date);
    const end = new Date(date);
    end.setDate(end.getDate() + 1);
    q.date = { $gte: start, $lt: end };
  }

  const trips = await Trip.find(q).sort({ date: 1 }).limit(12).lean();

  if (!trips.length) {
    return <p className="text-sm text-zinc-600">No hay viajes aún con esos filtros. Prueba a cambiar la búsqueda.</p>;
  }

  const creatorIds = trips.map((t: any) => t.creatorId);
  const creators = await User.find({ _id: { $in: creatorIds } }, { avatarUrl: 1 }).lean();
  const avatarById = new Map(creators.map((c: any) => [String(c._id), c.avatarUrl || ""]));

  return (
    <div className="grid gap-3">
      {trips.map((t: any) => (
        <TripCard
          key={String(t._id)}
          id={String(t._id)}
          destination={t.destination}
          team={t.team}
          dateLabel={fmtDate(new Date(t.date))}
          priceLabel={fmtPrice(t.priceCents)}
          avatarUrl={avatarById.get(String(t.creatorId)) || undefined}
        />
      ))}
    </div>
  );
}
