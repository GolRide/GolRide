import Link from "next/link";
import { requireSession } from "@/lib/auth";
import { dbConnect } from "@/lib/db";
import { Trip } from "@/models/Trip";
import { Reservation } from "@/models/Reservation";
import ContactOrganizerModal from "./ContactOrganizerModal";

function organizerLabelFromCreator(c: any) {
  const username = (c?.username || "").trim();
  const accountType = (c?.accountType || "particular").trim();
  const name = (c?.name || "").trim();

  if (accountType === "club" || accountType === "pena") return name || username || "Organizador";
  return name || username || "Organizador";
}

export default async function ReservationDetailPage({ params }: { params: { id: string } }) {
  let session: any = null;
  try {
    session = await requireSession();
  } catch {
    return (
      <main className="mx-auto max-w-4xl px-4 py-8">
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <div className="text-lg font-extrabold text-slate-900">Inicia sesión</div>
          <div className="mt-1 text-sm text-slate-600">
            Para ver el resumen de tu reserva necesitas entrar.
          </div>
          <Link
            href="/login?next=/dashboard/active-trips"
            className="mt-4 inline-flex rounded-xl bg-black text-white px-4 py-2 font-extrabold hover:opacity-90"
          >
            Ir a login
          </Link>
        </div>
      </main>
    );
  }

  const userId =
    session?.userId ||
    session?.user?.id ||
    session?.user?._id ||
    session?.user?.userId ||
    null;

  if (!userId) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-8">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 text-slate-700">
          No se pudo obtener tu sesión. Vuelve a iniciar sesión.
        </div>
      </main>
    );
  }

  await dbConnect();

  const tripId = params.id;

  const reservation = await Reservation.findOne({ userId, tripId, status: "paid" }).lean();
  const trip: any = await Trip.findById(tripId).populate("creatorId").lean();

  if (!trip) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-8">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 text-slate-700">
          No se encontró el viaje.
        </div>
      </main>
    );
  }

  const isCreator = String(trip.creatorId?._id || trip.creatorId) === String(userId);
  if (!reservation && !isCreator) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-8">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 text-slate-700">
          No tienes acceso a esta reserva.
        </div>
      </main>
    );
  }

  const c: any = trip.creatorId || {};
  const organizer = organizerLabelFromCreator(c);

  const phone = (c?.phone || c?.phoneNumber || c?.mobile || "").toString();
  const email = (c?.email || "").toString();

  const price = ((trip?.priceCents || 0) / 100).toFixed(2);

  return (
    <main className="mx-auto max-w-4xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between gap-3">
        <div>
          <div className="text-2xl font-black tracking-tight text-slate-900">Resumen de tu reserva</div>
          <div className="mt-1 text-sm font-bold text-slate-600">
            Viaje reservado · información completa y contacto del organizador
          </div>
        </div>

        <Link
          href="/dashboard/active-trips?tab=reservados"
          className="rounded-xl border border-slate-300 bg-white px-4 py-2 font-extrabold text-slate-700 hover:bg-slate-50"
        >
          Volver
        </Link>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <div className="text-sm font-semibold text-slate-800">
          <span className="text-slate-500 font-bold">Organizador: </span>
          <span className="font-extrabold text-slate-900">{organizer}</span>
        </div>

        <div className="mt-2 text-xl font-extrabold text-slate-900">
          {trip.origin} → {trip.destination}
        </div>

        <div className="mt-2 text-sm font-bold text-sky-700">
          {new Date(trip.date).toLocaleDateString("es-ES")}
          {trip.time ? ` · ${trip.time}` : ""}
        </div>

        <div className="mt-4 grid gap-2 text-sm">
          <div className="text-slate-800">
            <span className="text-slate-500 font-bold">Equipo: </span>
            {trip.team}
          </div>

          <div className="text-slate-700">
            <span className="text-slate-500 font-bold">Partido: </span>
            {trip.match}
          </div>

          {trip.isBase ? (
            <div className="text-slate-700">
              <span className="text-slate-500 font-bold">Fútbol base: </span>
              {trip.baseCategory || "Sí"}
            </div>
          ) : null}

          {trip.meetingPoint ? (
            <div className="text-slate-700">
              <span className="text-slate-500 font-bold">Punto de encuentro: </span>
              {trip.meetingPoint}
            </div>
          ) : null}

          <div className="text-slate-700">
            <span className="text-slate-500 font-bold">Precio: </span>
            <span className="font-extrabold text-teal-700">{price} €</span>
          </div>

          <div className="text-slate-700">
            <span className="text-slate-500 font-bold">Plazas: </span>
            <span className="font-extrabold text-teal-700">
              {trip.seatsAvailable}/{trip.seatsTotal}
            </span>
          </div>
        </div>

        <div className="mt-6">
          <ContactOrganizerModal phone={phone} email={email} />
        </div>
      </div>
    </main>
  );
}
