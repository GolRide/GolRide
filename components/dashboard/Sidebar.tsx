import Link from "next/link";

const items = [
  { href: "/dashboard/profile", label: "Perfil" },
  { href: "/dashboard/history", label: "Histórico de viajes" },
  { href: "/dashboard/active", label: "Viajes activos" },
  { href: "/dashboard/payments", label: "Pagos" },
];

export function Sidebar({ current }: { current: string }) {
  return (
    <aside className="rounded-2xl border bg-white p-3 shadow-soft">
      <nav className="grid gap-1">
        {items.map((it) => {
          const active = current === it.href;
          return (
            <Link
              key={it.href}
              href={it.href}
              className={`rounded-xl px-4 py-3 text-sm no-underline ${
                active ? "bg-zinc-900 text-white" : "hover:bg-zinc-100"
              }`}
            >
              {it.label}
            </Link>
          );
        })}
        <Link
          href="/publish"
          className="mt-2 rounded-xl border px-4 py-3 text-sm no-underline hover:bg-zinc-50"
        >
          Publicar viaje
        </Link>
      </nav>
    </aside>
  );
}
