import { dbConnect } from "@/lib/db";
import { Trip } from "@/models/Trip";
import User from "@/models/User";
import { TripInfoCard } from "@/components/trips/TripInfoCard";
import { buildLooseRegex } from "@/lib/search";

export async function TripsGrid({ searchParams }: { searchParams: Record<string, any> }) {
  await dbConnect();

  const origin = typeof searchParams.origin === "string" ? searchParams.origin.trim() : "";
  const destination = typeof searchParams.destination === "string" ? searchParams.destination.trim() : "";
  const date = typeof searchParams.date === "string" ? searchParams.date : "";
  const team = typeof searchParams.team === "string" ? searchParams.team.trim() : "";

  const q: any = { active: true };
  if (origin) q.origin = buildLooseRegex(origin);
  if (destination) q.destination = buildLooseRegex(destination);
  if (team) q.team = buildLooseRegex(team, { stripTeamWords: true });
  if (date) {
    const start = new Date(date);
    const end = new Date(date);
    end.setDate(end.getDate() + 1);
    q.date = { $gte: start, $lt: end };
  }

  const trips = await Trip.find(q).sort({ date: 1, time: 1 }).limit(12).lean();

  if (!trips.length) {
    return <p className="text-sm text-zinc-600">No hay viajes aún con esos filtros. Prueba a cambiar la búsqueda.</p>;
  }

  const creatorIds = trips.map((t: any) => t.creatorId);
  const creators = await User.find({ _id: { $in: creatorIds } }, { username: 1 }).lean();
  const nameById = new Map(creators.map((c: any) => [String(c._id), c.username || "Usuario"]));

  return (
    <div className="grid gap-3">
      {trips.map((t: any) => (
        <TripInfoCard
          key={String(t._id)}
          href={`/trips/${t._id}`}
          trip={{
            id: String(t._id),
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
            creatorName: nameById.get(String(t.creatorId)) || "Usuario",
          }}
        />
      ))}
    </div>
  );
}
