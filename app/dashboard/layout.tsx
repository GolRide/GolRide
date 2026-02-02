import Link from "next/link"
import { requireSession } from "@/lib/auth"

function NavItem({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="rounded-xl px-3 py-2 text-sm hover:bg-zinc-100"
    >
      {label}
    </Link>
  )
}

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  await requireSession()

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-[240px_1fr]">
        <aside className="rounded-2xl border bg-white p-3 h-fit">
          <div className="px-3 py-2 text-xs font-medium text-zinc-500">
            Panel
          </div>

          <div className="flex flex-col gap-1">
            <NavItem href="/dashboard/profile" label="Perfil" />
            <NavItem href="/dashboard/active-trips" label="Viajes activos" />
            <NavItem href="/dashboard/trip-history" label="Histórico de viajes" />
          </div>

          <div className="mt-3 border-t pt-3">
            <Link
              href="/trips/new"
              className="block rounded-xl px-3 py-2 text-sm font-medium hover:bg-zinc-100"
             legacyBehavior>
<a href="/trips/new" className="font-extrabold">+ Publicar viaje</a>
            </Link>
          </div>
        </aside>

        <main className="min-h-[60vh]">{children}</main>
      </div>
    </div>
  )
}

