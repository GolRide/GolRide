import { Card } from "@/components/ui/Card";
import { ButtonLink } from "@/components/ui/Button";

export default function CancelPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-14">
      <div className="mx-auto max-w-lg">
        <Card title="Pago cancelado" desc="No se ha realizado el cobro.">
          <div className="mt-4">
            <ButtonLink href="/" variant="secondary">Volver al inicio</ButtonLink>
          </div>
        </Card>
      </div>
    </div>
  );
}
