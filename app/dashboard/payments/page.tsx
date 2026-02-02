import { PageShell } from "@/components/dashboard/PageShell";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { dbConnect } from "@/lib/db";
import { requireSession } from "@/lib/auth";
import User from "@/models/User";

export default async function PaymentsPage() {
  const session = requireSession();
  await dbConnect();
  const user: any = await User.findById(session.userId).lean();

  return (
    <PageShell current="/dashboard/payments">
      <Card title="Pagos" desc="Registra tu cuenta (IBAN) para recibir pagos.">
        <form action="/api/user/update-payout" method="post" className="grid gap-3 max-w-xl">
          <div>
            <label className="text-sm font-medium">IBAN</label>
            <Input name="payoutIban" defaultValue={user?.payoutIban || ""} placeholder="ES00 0000 0000 0000 0000 0000" />
          </div>
          <Button type="submit">Guardar</Button>
          <p className="text-xs text-zinc-600">
            Nota: en este MVP guardamos el IBAN. En producción se recomienda usar Stripe Connect para payouts.
          </p>
        </form>
      </Card>
    </PageShell>
  );
}
