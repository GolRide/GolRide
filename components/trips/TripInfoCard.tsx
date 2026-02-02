import Link from "next/link";
import { getDepartureDate } from "@/lib/trips";

export type TripInfo = {
  id: string;
  origin: string;
  destination: string;
  meetingPoint?: string;
  date: string | Date;
  time?: string;
  team: string;
  match: string;
  seatsAvailable: number;
  seatsTotal: number;
  priceCents: number;
  creatorName?: string;
};

function formatDate(value: string | Date) {
  try {
    return getDepartureDate({ date: value }).toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return String(value);
  }
}

export function TripInfoCard({ trip, href }: { trip: TripInfo; href: string }) {
  return (
    <Link
      href={href}
      className="block rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-slate-300 hover:shadow"
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="text-sm font-extrabold text-sky-700">
            {trip.origin} → {trip.destination}
          </div>
          {trip.meetingPoint && (
            <div className="mt-1 text-xs font-semibold text-sky-600">
              Punto de encuentro: {trip.meetingPoint}
            </div>
          )}
          <div className="mt-2 text-xs text-slate-500">
            {formatDate(trip.date)}{trip.time ? ` · ${trip.time}` : ""}
          </div>

          <div className="mt-2 flex flex-wrap gap-x-2 gap-y-1 text-xs font-bold text-indigo-700">
            <span>{trip.team}</span>
            <span>·</span>
            <span>{trip.match}</span>
          </div>

          <div className="mt-2 text-xs font-semibold text-emerald-700">
            {(trip.priceCents / 100).toFixed(2)} € · {trip.seatsAvailable} / {trip.seatsTotal} plazas
          </div>

          <div className="mt-2 text-xs font-semibold text-cyan-700">
            Usuario: {trip.creatorName || "Usuario"}
          </div>
        </div>
      </div>
    </Link>
  );
}
