import Link from "next/link";

export function TripCard({
  id,
  destination,
  team,
  dateLabel,
  priceLabel,
  avatarUrl,
}: {
  id: string;
  destination: string;
  team: string;
  dateLabel: string;
  priceLabel: string;
  avatarUrl?: string;
}) {
  return (
    <Link
      href={`/trips/${id}`}
      className="block no-underline"
    >
      <div className="rounded-2xl border bg-white p-5 shadow-soft hover:shadow transition">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs text-zinc-500">Destino</p>
            <p className="text-lg font-semibold leading-tight">{destination}</p>
            <p className="mt-1 text-sm text-zinc-700">
              Equipo: <span className="font-medium">{team}</span>
            </p>
            <p className="mt-1 text-sm text-zinc-700">Fecha: {dateLabel}</p>
          </div>
          <div className="flex flex-col items-end gap-3">
            <div className="h-10 w-10 overflow-hidden rounded-full border bg-zinc-50">
              <img
                src={avatarUrl || "/images/avatar-placeholder.svg"}
                alt="Foto de perfil"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="rounded-xl bg-zinc-900 px-3 py-2 text-sm font-semibold text-white">
              {priceLabel}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
