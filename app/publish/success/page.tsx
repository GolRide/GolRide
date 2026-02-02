import { Card } from "@/components/ui/Card";
import { ButtonLink } from "@/components/ui/Button";
import { absoluteUrl } from "@/lib/url";

export default function PublishSuccess({ searchParams }: { searchParams: Record<string, string | undefined> }) {
  const tripId = searchParams?.tripId ? String(searchParams.tripId) : "";
  const link = tripId ? absoluteUrl(`/trips/${tripId}`) : "";

  return (
    <div className="mx-auto max-w-6xl px-4 py-14">
      <div className="mx-auto max-w-lg">
        <Card title="Viaje publicado" desc="Hemos enviado un email de confirmación.">
          {tripId ? (
            <>
              <p className="mt-2 text-sm text-zinc-700">Enlace del viaje (cópialo o compártelo):</p>
              <p className="mt-2 rounded-2xl border bg-zinc-50 p-3 text-sm break-all">{link}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <ButtonLink href={`/trips/${tripId}`}>Ver viaje</ButtonLink>
                <a
                  className="inline-flex items-center justify-center rounded-xl border px-5 py-3 text-sm font-medium no-underline hover:bg-zinc-50"
                  href={`https://wa.me/?text=${encodeURIComponent(`Mira este viaje en GolRide: ${link}`)}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  Compartir por WhatsApp
                </a>
              </div>
            </>
          ) : null}
          <div className="mt-6">
            <ButtonLink href="/dashboard/active" variant="secondary">Ir a viajes activos</ButtonLink>
          </div>
        </Card>
      </div>
    </div>
  );
}
