import { Reservation } from "@/models/Reservation";
import Link from "next/link";
import ContactUserModal from "./ContactUserModal";
import { headers } from "next/headers";
import { requireSession } from "@/lib/auth";
import OwnerActions from "./OwnerActions";
import ShareButtons from "./ShareButtons";

type PageProps = { params: { id: string } };

function initials(name?: string) {
  const s = (name || "U").trim();
  const parts = s.split(/\s+/).filter(Boolean);
  const a = parts[0]?.[0] || "U";
  const b = parts[1]?.[0] || "";
  return (a + b).toUpperCase();
}


function getUserId(session: any): string | null {
  return (
    session?.user?.id ||
    session?.user?._id ||
    session?.userId ||
    session?.id ||
    null
  );
}

async function getTrip(id: string) {
  const h = headers();
  const host = h.get("host");
  const proto = process.env.NODE_ENV === "development" ? "http" : "https";
  const res = await fetch(`${proto}://${host}/api/trips/${id}`, { cache: "no-store" });
  const data = await res.json().catch(() => null);
  return data?.trip ?? null;
}

export default async function TripPage({ params }: PageProps) {
  const trip = await getTrip(params.id);

  // URL para compartir (válida en dev/prod)
  const h = headers();
  const host = h.get("host");
  const proto = process.env.NODE_ENV === "development" ? "http" : "https";
  const shareUrl = `${proto}://${host}/trips/${params.id}`;

  let session: any = null;
  try {
    session = await requireSession();
  } catch {
    session = null; // público
  }

  const userId = getUserId(session);
  const creatorId = (trip as any)?.creatorId?._id || (trip as any)?.creatorId || (trip as any)?.creator?._id || (trip as any)?.creator;
  const isOwner = trip && userId && String(creatorId) === String(userId);

  // Reservas (solo si eres el organizador)
  const reservations: any[] = isOwner
    ? await Reservation.find({ tripId: String(trip._id), status: "paid" })
        .populate("userId")
        .sort({ createdAt: 1 })
        .lean()
    : [];

  if (!trip) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-10">
        <div className="rounded-2xl border bg-white p-6">
          <h1 className="text-xl font-bold">Viaje no encontrado</h1>
          <p className="mt-2 text-slate-600">Puede que se haya eliminado o el enlace sea incorrecto.</p>
          <div className="mt-6">
            <Link href="/trips" className="rounded-xl bg-slate-900 px-4 py-2 text-[15px] font-black text-white hover:bg-slate-800 text-center">Volver</Link>
          </div>
        </div>
      
      {isOwner ? (
        <div className="mt-8">
          <div className="rounded-2xl border border-slate-200 bg-white p-6">
            <div className="flex items-center justify-between gap-3">
              <div className="text-lg font-extrabold text-slate-900">Reservas</div>
              <div className="text-sm font-extrabold text-slate-700">
                {reservations.length}/{(trip as any)?.seatsTotal ?? "?"}
              </div>
            </div>

            <div className="mt-4 grid gap-2">
              {reservations.length ? (
                reservations.map((r: any) => {
                  const u: any = r.userId || {};
                  const name =
                    (u?.name || "").toString().trim() ||
                    (u?.username || "").toString().trim() ||
                    (u?.email || "").toString().trim() ||
                    "Usuario";

                  const phone =
                    (u?.phone || u?.phoneNumber || u?.mobile || "").toString();

                  const email =
                    (u?.email || "").toString();

                  const msg =
                    "Hola, has reservado una plaza conmigo en GolRide para este viaje. Te escribo para confirmar que todo está correcto 🙂";

                  return (
                    <div
                      key={String(r._id)}
                      className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4"
                    >
                      <div className="min-w-0">
                        <div className="text-sm font-extrabold text-slate-900 truncate">
                          {name}
                        </div>
                        <div className="text-xs font-bold text-slate-500 truncate">
                          {email}
                        </div>
                      </div>

                      <ContactUserModal phone={phone} email={email} message={msg} />
                    </div>
                  );
                })
              ) : (
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm font-bold text-slate-600">
                  Aún no hay reservas.
                </div>
              )}
            </div>
          </div>
        </div>
      ) : null}

    </main>
    );
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <div className="grid gap-6 md:grid-cols-[1fr_360px]">
        <section className="rounded-2xl border bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-5">
            <div>
              <div className="text-xs font-extrabold text-slate-600">Ruta</div>
              <div className="mt-1 text-xl font-black text-slate-900">
                {trip.origin} → {trip.destination}
              </div>
              <div className="mt-3 flex items-center gap-3">
                <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full border border-slate-200 bg-slate-100 flex items-center justify-center font-extrabold text-slate-700">
                  {(() => {
                    const c: any = (trip as any)?.creator || (trip as any)?.creatorId;
                    const avatar = (c?.avatar || "").trim();
                    const u = (c?.username || "").trim() || "Usuario";
                    if (avatar) {
                      return (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={avatar} alt="avatar" className="h-full w-full object-cover" />
                      );
                    }
                    return initials(u);
                  })()}
                </div>

                <div className="text-sm font-semibold text-slate-800">
                  <span className="text-slate-500 font-bold">Organizador: </span>
                  <span className="font-extrabold text-slate-900">
                    {(() => {
                      const c: any = (trip as any)?.creator || (trip as any)?.creatorId;
                      const username = (c?.username || "").trim() || "Usuario";
                      const accountType = (c?.accountType || "particular").trim();
                      const nameOnly = (c?.name || "").trim();
                      const isOrgEntity = accountType === "club" || accountType === "pena";
                      if (isOrgEntity) return username;
                      return nameOnly || username;
                    })()}
                  </span>
                </div>
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-extrabold text-slate-700">
                  {new Date(trip.date).toLocaleDateString("es-ES")}{trip.time ? ` · ${trip.time}` : ""}
                </span>

                <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-extrabold text-slate-700">
                  {trip.seatsAvailable} / {trip.seatsTotal} plazas
                </span>

                <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-extrabold text-slate-700">
                  {(trip.priceCents / 100).toFixed(2)} € / plaza
                </span>
</div>
            </div>

            <div className="rounded-2xl border border-slate-200 p-4">
              {trip.meetingPoint ? (
                <>
                  <div className="text-xs font-extrabold text-slate-700">Punto de encuentro</div>
                  <div className="mt-1 text-sm font-semibold text-slate-900">{trip.meetingPoint}</div>
                </>
              ) : (
                <>
                  <div className="text-xs font-extrabold text-slate-700">Punto de encuentro</div>
                  <div className="mt-1 text-sm text-slate-500">No especificado</div>
                </>
              )}

              <div className="mt-4 grid gap-2">
                <div className="text-sm font-semibold text-slate-800">
                  <span className="text-slate-500 font-bold">Equipo: </span>
                  <span className="text-slate-900">{trip.team}</span>
                </div>
                <div className="text-sm font-semibold text-slate-800">
                  <span className="text-slate-500 font-bold">Partido: </span>
                  <span className="text-slate-900">{trip.match}</span>
                </div>
                {trip.isBase ? (
                  <div className="text-sm font-semibold text-slate-800">
                    <span className="text-slate-500 font-bold">Fútbol base: </span>
                    <span className="text-slate-900">{trip.baseCategory || "Sí"}</span>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </section>

        <aside className="rounded-2xl border bg-white p-6 shadow-sm">
          {isOwner ? (
            <>
              <div className="text-lg font-black text-slate-900">Este viaje es tuyo</div>
                            <ShareButtons url={shareUrl} />

              <div className="mt-5 flex flex-col gap-2">
                <Link
                  href={`/trips/${params.id}/edit`}
                  className="rounded-xl bg-black text-white px-4 py-3 font-bold text-center hover:opacity-90"
                >
                  Editar viaje
                </Link>

                <Link
                  href="/dashboard/active-trips"
                  className="rounded-xl border px-4 py-3 font-bold text-center hover:bg-zinc-50"
                >
                  Ir a mis viajes activos
                </Link>

                <OwnerActions tripId={params.id} />
              </div>
            </>
          ) : (
            <>
              <p className="mt-2 text-slate-600">
                Tras completar tu reserva, te mostraremos el contacto del organizador para coordinar el viaje.
              </p>

              <div className="mt-5">
                <Link
                  href={`/reserve/${params.id}`}
                  className="block w-full rounded-xl bg-black text-white px-4 py-3 font-bold hover:opacity-90 text-center"
                >
                  Reservar
                </Link>
              </div>
            </>
          )}
        </aside>
      </div>
    </main>
  );
}
