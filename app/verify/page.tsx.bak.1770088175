import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export default function VerifyPage({ searchParams }: { searchParams: Record<string, string | undefined> }) {
  const email = searchParams?.email ? String(searchParams.email) : "";

  return (
    <div className="mx-auto max-w-6xl px-4 py-14">
      <div className="mx-auto max-w-lg">
        <Card
          title="Verifica tu email"
          desc="Te hemos enviado un código. Escríbelo aquí para activar la cuenta."
        >
          <form action="/api/auth/verify" method="post" className="grid gap-3">
            <div>
              <label className="text-sm font-medium">Email</label>
              <Input name="email" type="email" required defaultValue={email} />
            </div>
            <div>
              <label className="text-sm font-medium">Código</label>
              <Input name="code" required placeholder="123456" />
            </div>
            <Button type="submit">Verificar</Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
