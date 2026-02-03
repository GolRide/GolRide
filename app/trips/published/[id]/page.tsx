import Link from "next/link";
import ActionsClient from "./ActionsClient";

type PageProps = { params: { id: string } };

async function getTrip(id: string) {
  const base =
    process.env.NEXT_PUBLIC_SITE_URL ??
    process.env.NEXT_PUBLIC_BASE_URL ??
    "http://localhost:3000";

  const res = await fetch(`${base}/api/trips/${id}`, { cache: "no-store" });
  if (!res.ok) return null;
  return res.json();
}

export default async function TripPublishedPage({ params }: PageProps) {
  const tripData = await getTrip(params.id);
  const trip = tripData?.trip ?? tripData ?? null;

  const base =
    process.env.NEXT_PUBLIC_SITE_URL ??
    process.env.NEXT_PUBLIC_BASE_URL ??
    "http://localhost:3000";

  const shareUrl = `${base}/trips/${params.id}`;

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <div className="rounded-2xl border bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold tracking-tight">🎉 ¡Enhorabuena!</h1>
        <p className="mt-2 text-zinc-600">Tu viaje ya ha sido creado correctamente.</p>

        <div className="mt-6 rounded-2xl border bg-zinc-50 p-4">
          <p className="text-sm font-medium text-zinc-700">Enlace del viaje</p>
          <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-center">
            <code className="break-all rounded-xl bg-white px-3 py-2 text-sm border">
              {shareUrl}
            </code>
            <ActionsClient shareUrl={shareUrl} />
          </div>
        </div>

        <div className="mt-6">
          <h2 className="text-lg font-semibold">Viaje creado</h2>

          {!trip ? (
            <p className="mt-2 text-zinc-600">
              No pude cargar el viaje desde la API (si el GET por id devuelve 404, es normal). El enlace y botones funcionan igual.
            </p>
          ) : (
            <div className="mt-3 grid gap-3 rounded-2xl border p-4">
              <div>
                <p className="text-sm text-zinc-500">Ruta</p>
                <p className="font-medium">
                  {trip.origin} → {trip.destination}
                </p>
              </div>

              {trip.meetingPoint ? (
                <div>
                  <p className="text-sm text-zinc-500">Punto de encuentro</p>
                  <p className="font-medium">{trip.meetingPoint}</p>
                </div>
              ) : null}

              <div>
                <p className="text-sm text-zinc-500">Partido / Equipo</p>
                <p className="font-medium">
                  {trip.match} · {trip.team}
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="mt-6 flex items-center gap-3">
          <Link href="/dashboard/active-trips" className="rounded-xl border px-4 py-2 hover:bg-zinc-50">
            Ver viajes
          </Link>
          <Link href="/trips/new" className="rounded-xl bg-black text-white px-4 py-2 hover:opacity-90">
            Publicar otro
          </Link>
        </div>
      </div>
    </main>
  );
}
