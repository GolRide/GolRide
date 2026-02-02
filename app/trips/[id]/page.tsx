import { dbConnect } from "@/lib/db";
import { Trip } from "@/models/Trip";
import User from "@/models/User";
import { Reservation } from "@/models/Reservation";
import { Card } from "@/components/ui/Card";
import { Button, ButtonLink } from "@/components/ui/Button";
import { getSession } from "@/lib/auth";
import Link from "next/link";

function fmtDate(d: Date) {
  return new Intl.DateTimeFormat("es-ES", { dateStyle: "full" }).format(d);
}
function fmtPrice(cents: number) {
  return new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" }).format(cents / 100);
}

export default async function TripPage({ params }: { params: { id: string } }) {
  const session = getSession();
  await dbConnect();

  const trip: any = await Trip.findById(params.id).lean();
  if (!trip) return <div className="mx-auto max-w-6xl px-4 py-14">No encontrado.</div>;

  const creator: any = await User.findById(trip.creatorId).lean();
  const isOwner = session?.userId === String(trip.creatorId);

  let myReservation: any = null;
  if (session && !isOwner) {
    myReservation = await Reservation.findOne({ tripId: trip._id, userId: session.userId }).lean();
  }

  // Contact only if: owner OR reservation paid
  let contactValue: string | null = null;
  if (isOwner) {
    contactValue = creator?.contactMethod === "whatsapp" ? creator?.phone : creator?.email;
  } else if (myReservation?.status === "paid") {
    contactValue = creator?.contactMethod === "whatsapp" ? creator?.phone : creator?.email;
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-14">
      <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
        <Card title={`${trip.origin} → ${trip.destination}`} desc={`Equipo: ${trip.team} · Partido: ${trip.match}`}>
          <div className="mt-2 grid gap-2 text-sm text-zinc-700">
            <p><span className="font-medium">Fecha:</span> {fmtDate(new Date(trip.date))}</p>
            <p><span className="font-medium">Plazas disponibles:</span> {trip.seatsAvailable} / {trip.seatsTotal}</p>
            <p><span className="font-medium">Precio:</span> {fmtPrice(trip.priceCents)} por plaza</p>
          </div>

          <div className="mt-6 flex items-center gap-3">
            <div className="h-12 w-12 overflow-hidden rounded-full border bg-zinc-50">
              <img src={creator?.avatarUrl || "/images/avatar-placeholder.svg"} alt="Perfil" className="h-full w-full object-cover" />
            </div>
            <div>
              <p className="text-sm font-semibold">{creator?.username || "Organizador"}</p>
              <p className="text-xs text-zinc-500">
                Contacto visible tras el pago
              </p>
            </div>
          </div>

          <div className="mt-6">
            {contactValue ? (
              <div className="rounded-2xl border bg-zinc-50 p-4">
                <p className="text-xs text-zinc-500">Contacto desbloqueado</p>
                <p className="mt-1 text-sm font-semibold break-all">{contactValue}</p>
              </div>
            ) : (
              <div className="rounded-2xl border bg-zinc-50 p-4">
                <p className="text-sm text-zinc-700">
                  El contacto se desbloquea <span className="font-medium">después del pago</span>.
                </p>
              </div>
            )}
          </div>
        </Card>

        <Card title="Reserva">
          {!session ? (
            <>
              <p className="text-sm text-zinc-700">Para reservar necesitas iniciar sesión.</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <ButtonLink href={`/login?next=/trips/${trip._id}`} variant="primary">Iniciar sesión</ButtonLink>
                <ButtonLink href="/register" variant="secondary">Registrarse</ButtonLink>
              </div>
            </>
          ) : isOwner ? (
            <>
              <p className="text-sm text-zinc-700">Este viaje es tuyo.</p>
              <div className="mt-4 flex gap-2">
                <ButtonLink href="/dashboard/active" variant="secondary">Ir a viajes activos</ButtonLink>
              </div>
              <div className="mt-4">
                <p className="text-xs text-zinc-600">Enlace para compartir:</p>
                <p className="mt-1 text-sm break-all">{`${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/trips/${trip._id}`}</p>
              </div>
            </>
          ) : trip.seatsAvailable < 1 ? (
            <p className="text-sm text-zinc-700">No quedan plazas disponibles.</p>
          ) : myReservation?.status === "paid" ? (
            <>
              <p className="text-sm text-zinc-700">Ya tienes una plaza reservada (pagada).</p>
              <div className="mt-4 flex gap-2">
                <ButtonLink href="/dashboard/history" variant="secondary">Ver histórico</ButtonLink>
              </div>
            </>
          ) : (
            <form action="/api/reservations/create" method="post" className="grid gap-3">
              <input type="hidden" name="tripId" value={String(trip._id)} />
              <Button type="submit">Reservar y pagar</Button>
              <p className="text-xs text-zinc-600">
                Serás redirigido a Stripe para completar el pago.
              </p>
            </form>
          )}

          <div className="mt-6 border-t pt-4">
            <Link href="/" className="text-sm font-medium">Volver al inicio</Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
