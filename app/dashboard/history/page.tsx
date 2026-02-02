import { PageShell } from "@/components/dashboard/PageShell";
import { Card } from "@/components/ui/Card";
import { dbConnect } from "@/lib/db";
import { requireSession } from "@/lib/auth";
import { Reservation } from "@/models/Reservation";
import { Trip } from "@/models/Trip";

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

  return (
    <PageShell current="/dashboard/history">
      <Card title="Histórico de viajes" desc="Viajes en los que has participado (pagados).">
        {!res.length ? (
          <p className="text-sm text-zinc-600">Aún no tienes viajes en tu histórico.</p>
        ) : (
          <div className="grid gap-3">
            {res.map((r: any) => {
              const t: any = byId.get(String(r.tripId));
              if (!t) return null;
              return (
                <div key={String(r._id)} className="rounded-2xl border p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold">{t.origin} → {t.destination}</p>
                      <p className="text-sm text-zinc-700">Equipo: {t.team} · Partido: {t.match}</p>
                    </div>
                    <a className="text-sm font-medium" href={`/trips/${t._id}`}>Ver</a>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>
    </PageShell>
  );
}
