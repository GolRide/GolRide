import { Card } from "@/components/ui/Card";
import { ButtonLink } from "@/components/ui/Button";

export default function SuccessPage({ searchParams }: { searchParams: Record<string, string | undefined> }) {
  const tripId = searchParams?.tripId ? String(searchParams.tripId) : "";
  return (
    <div className="mx-auto max-w-6xl px-4 py-14">
      <div className="mx-auto max-w-lg">
        <Card title="Pago completado" desc="Tu reserva se ha confirmado.">
          <div className="mt-4 flex flex-wrap gap-2">
            {tripId ? <ButtonLink href={`/trips/${tripId}`}>Ver viaje</ButtonLink> : null}
            <ButtonLink href="/dashboard/history" variant="secondary">Ir a histórico</ButtonLink>
          </div>
          <p className="mt-5 text-sm text-zinc-600">
            Te hemos enviado un email de confirmación.
          </p>
        </Card>
      </div>
    </div>
  );
}
