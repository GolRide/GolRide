import { Card } from "@/components/ui/Card";
import { TripInfoCard } from "@/components/trips/TripInfoCard";
import { dbConnect } from "@/lib/db";
import { requireSession } from "@/lib/auth";
import { Trip } from "@/models/Trip";
import User from "@/models/User";
import { getDepartureDate, sortTripsByDeparture } from "@/lib/trips";

export default async function TripHistoryPage() {
  const session = await requireSession();
  await dbConnect();

  const trips = await Trip.find({ creatorId: session.userId }).lean();
  const now = new Date();
  const pastTrips = trips
    .filter((trip: any) => getDepartureDate({ date: trip.date, time: trip.time }) < now)
    .sort(sortTripsByDeparture);

  const user = await User.findById(session.userId, { username: 1 }).lean();
  const username = (user as any)?.username || "Usuario";

  return (
    <Card title="Histórico de viajes" desc="Tus viajes completados como organizador.">
      {!pastTrips.length ? (
        <p className="text-sm text-zinc-600">Aún no tienes viajes completados.</p>
      ) : (
        <div className="grid gap-3">
          {pastTrips.map((trip: any) => (
            <TripInfoCard
              key={String(trip._id)}
              href={`/trips/${trip._id}`}
              trip={{
                id: String(trip._id),
                origin: trip.origin,
                destination: trip.destination,
                meetingPoint: trip.meetingPoint || "",
                date: trip.date,
                time: trip.time,
                match: trip.match,
                team: trip.team,
                seatsAvailable: trip.seatsAvailable,
                seatsTotal: trip.seatsTotal,
                priceCents: trip.priceCents,
                creatorName: username,
              }}
            />
          ))}
        </div>
      )}
    </Card>
  );
}
