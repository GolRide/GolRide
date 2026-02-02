import { PageShell } from "@/components/dashboard/PageShell";
import { Card } from "@/components/ui/Card";
import { dbConnect } from "@/lib/db";
import { requireSession } from "@/lib/auth";
import { Reservation } from "@/models/Reservation";
import { Trip } from "@/models/Trip";

export default async function ActivePage() {
  const session = requireSession();
  await dbConnect();

  const myTrips: any[] = await Trip.find({ creatorId: session.userId, active: true }).sort({ date: 1 }).lean();
  const myRes: any[] = await Reservation.find({ userId: session.userId, status: { $in: ["pending", "paid"] } })
    .sort({ createdAt: -1 })
    .limit(50)
    .lean();

  const tripIds = myRes.map((r) => r.tripId);
  const trips = await Trip.find({ _id: { $in: tripIds } }).lean();
  const byId = new Map(trips.map((t: any) => [String(t._id), t]));

  return (
    <PageShell current="/dashboard/active">
      <div className="grid gap-6">
        <Card title="Viajes publicados" desc="Tus viajes activos (con enlace para compartir).">
          {!myTrips.length ? (
            <p className="text-sm text-zinc-600">Aún no has publicado viajes.</p>
          ) : (
            <div className="grid gap-3">
              {myTrips.map((t: any) => (
                <div key={String(t._id)} className="rounded-2xl border p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold">{t.origin} → {t.destination}</p>
                      <p className="text-sm text-zinc-700">Equipo: {t.team} · Fecha: {new Date(t.date).toLocaleDateString("es-ES")}</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <a className="rounded-xl border px-3 py-2 text-sm no-underline hover:bg-zinc-50" href={`/trips/${t._id}`}>Ver</a>
                      <a
                        className="rounded-xl bg-zinc-900 px-3 py-2 text-sm text-white no-underline hover:bg-zinc-800"
                        href={`https://wa.me/?text=${encodeURIComponent(`Mira este viaje en GolRide: ${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/trips/${t._id}`)}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Compartir WhatsApp
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card title="Reservas" desc="Plazas reservadas o pendientes de pago.">
          {!myRes.length ? (
            <p className="text-sm text-zinc-600">No tienes reservas todavía.</p>
          ) : (
            <div className="grid gap-3">
              {myRes.map((r: any) => {
                const t: any = byId.get(String(r.tripId));
                if (!t) return null;
                return (
                  <div key={String(r._id)} className="rounded-2xl border p-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold">{t.origin} → {t.destination}</p>
                        <p className="text-sm text-zinc-700">Estado: {r.status}</p>
                      </div>
                      <a className="text-sm font-medium" href={`/trips/${t._id}`}>Ver</a>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>
      </div>
    </PageShell>
  );
}
