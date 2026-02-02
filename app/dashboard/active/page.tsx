import { Card } from "@/components/ui/Card";
import { dbConnect } from "@/lib/db";
import { requireSession } from "@/lib/auth";
import { Reservation } from "@/models/Reservation";
import { Trip } from "@/models/Trip";
import { TripInfoCard } from "@/components/trips/TripInfoCard";
import { getDepartureDate, sortTripsByDeparture } from "@/lib/trips";
import User from "@/models/User";

export default async function ActivePage() {
  const session = requireSession();
  await dbConnect();

  const myTripsAll: any[] = await Trip.find({ creatorId: session.userId, active: true }).sort({ date: 1, time: 1 }).lean();
  const myRes: any[] = await Reservation.find({ userId: session.userId, status: { $in: ["pending", "paid"] } })
    .sort({ createdAt: -1 })
    .limit(50)
    .lean();

  const tripIds = myRes.map((r) => r.tripId);
  const trips = await Trip.find({ _id: { $in: tripIds } }).lean();
  const byId = new Map(trips.map((t: any) => [String(t._id), t]));
  const now = new Date();

  const myTrips = myTripsAll.filter((t) => getDepartureDate({ date: t.date, time: t.time }) >= now);
  myTrips.sort(sortTripsByDeparture);
  const creatorIds = [...new Set([...myTrips.map((t) => t.creatorId), ...trips.map((t) => t.creatorId)])];
  const creators = await User.find({ _id: { $in: creatorIds } }, { username: 1 }).lean();
  const creatorById = new Map(creators.map((c: any) => [String(c._id), c.username || "Usuario"]));
  const upcomingReservations = myRes
    .map((r: any) => ({ reservation: r, trip: byId.get(String(r.tripId)) }))
    .filter(({ trip }) => trip && getDepartureDate({ date: trip.date, time: trip.time }) >= now)
    .sort((a, b) => sortTripsByDeparture(a.trip, b.trip));

  return (
    <div className="grid gap-6">
      <Card title="Viajes publicados" desc="Tus viajes activos (con enlace para compartir).">
        {!myTrips.length ? (
          <p className="text-sm text-zinc-600">Aún no has publicado viajes.</p>
        ) : (
          <div className="grid gap-3">
            {myTrips.map((t: any) => (
              <div key={String(t._id)} className="grid gap-2">
                <TripInfoCard
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
                    creatorName: creatorById.get(String(t.creatorId)) || "Usuario",
                  }}
                />
                <div className="flex flex-wrap gap-2">
                  <a
                    className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-extrabold text-slate-900 no-underline hover:bg-slate-50"
                    href={`/trips/${t._id}`}
                  >
                    Ver
                  </a>
                  <a
                    className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-3 py-2 text-sm font-extrabold text-white no-underline hover:bg-slate-800"
                    href={`https://wa.me/?text=${encodeURIComponent(`Mira este viaje en GolRide: ${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/trips/${t._id}`)}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Compartir WhatsApp
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      <Card title="Reservas" desc="Plazas reservadas o pendientes de pago.">
        {!upcomingReservations.length ? (
          <p className="text-sm text-zinc-600">No tienes reservas todavía.</p>
        ) : (
          <div className="grid gap-3">
            {upcomingReservations.map(({ reservation, trip }) => (
                <div key={String(reservation._id)} className="grid gap-2">
                  <TripInfoCard
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
                  <div className="text-xs font-semibold text-slate-600">
                    Estado: <span className="font-extrabold text-slate-900">{reservation.status}</span>
                  </div>
                </div>
              ))}
          </div>
        )}
      </Card>
    </div>
  );
}
