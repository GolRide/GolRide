import { Card } from "@/components/ui/Card";
import { dbConnect } from "@/lib/db";
import { requireSession } from "@/lib/auth";
import { Reservation } from "@/models/Reservation";
import { Trip } from "@/models/Trip";
import { TripInfoCard } from "@/components/trips/TripInfoCard";
import { getDepartureDate, sortTripsByDeparture } from "@/lib/trips";
import User from "@/models/User";

export default async function HistoryPage() {
  const session = requireSession();
  await dbConnect();

  const res: any[] = await Reservation.find({ userId: session.userId, status: "paid" })
    .sort({ createdAt: -1 })
    .limit(50)
    .lean();

  const tripIds = res.map((r) => r.tripId);
  const trips = await Trip.find({ _id: { $in: tripIds } }).lean();
  const byId = new Map(trips.map((t: any) => [String(t._id), t]));
  const now = new Date();
  const creatorIds = [...new Set(trips.map((t: any) => t.creatorId))];
  const creators = await User.find({ _id: { $in: creatorIds } }, { username: 1 }).lean();
  const creatorById = new Map(creators.map((c: any) => [String(c._id), c.username || "Usuario"]));

  const pastReservations = res
    .map((r: any) => ({ reservation: r, trip: byId.get(String(r.tripId)) }))
    .filter(({ trip }) => trip && getDepartureDate({ date: trip.date, time: trip.time }) < now)
    .sort((a, b) => sortTripsByDeparture(a.trip, b.trip));

  return (
    <Card title="Histórico de viajes" desc="Viajes en los que has participado (pagados).">
      {!pastReservations.length ? (
        <p className="text-sm text-zinc-600">Aún no tienes viajes en tu histórico.</p>
      ) : (
        <div className="grid gap-3">
          {pastReservations.map(({ reservation, trip }) => (
            <TripInfoCard
              key={String(reservation._id)}
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
                creatorName: creatorById.get(String(trip.creatorId)) || "Usuario",
              }}
            />
          ))}
        </div>
      )}
    </Card>
  );
}
