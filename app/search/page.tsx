import Link from "next/link";
import { headers } from "next/headers";
import { Page } from "@/components/ui/Page";
import { Card, CardBody } from "@/components/ui/Card";

type Trip = {
  _id: string;
  origin: string;
  destination: string;
  date: string;
  time?: string;
  match: string;
  team: string;
  seatsAvailable: number;
  seatsTotal: number;
  priceCents: number;
  creator: { username?: string; avatar?: string };
};

async function getResults(params: Record<string, string>): Promise<Trip[]> {
  const h = headers();
  const host = h.get("host");
  const proto = process.env.NODE_ENV === "development" ? "http" : "https";

  const qs = new URLSearchParams(params).toString();
  const res = await fetch(`${proto}://${host}/api/trips?${qs}`, { cache: "no-store" });
  const data = await res.json();
  return data.trips || [];
}

function initials(name?: string) {
  const s = (name || "U").trim();
  return s.slice(0, 1).toUpperCase();
}

export default async function SearchPage({ searchParams }: { searchParams: any }) {
  const origin = String(searchParams?.origin || "").trim();
  const destination = String(searchParams?.destination || "").trim();
  const team = String(searchParams?.team || "").trim();
  const date = String(searchParams?.date || "").trim();

  // Si faltan campos, no mostramos resultados
  const missing = !origin || !destination || !team || !date;
  const trips = missing ? [] : await getResults({ origin, destination, team, date });

  return (
    <Page>
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900">Resultados</h1>
          <p className="mt-1 text-sm text-slate-600">
            {missing
              ? "Completa el buscador en la página principal para ver resultados."
              : `Mostrando viajes para: ${origin} → ${destination} · ${team} · ${date}`}
          </p>
        </div>
        <Link href="/" className="text-sm font-black text-slate-900 underline">
          Volver
        </Link>
      </div>

      <div className="mt-4 grid gap-3">
        {trips.map((t) => (
          <Link key={t._id} href={`/trips/${t._id}`} className="no-underline">
            <Card className="hover:shadow-md transition">
              <CardBody className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-slate-900 text-white flex items-center justify-center font-black">
                    {t.creator?.avatar ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={t.creator.avatar} alt="" className="h-10 w-10 rounded-full object-cover" />
                    ) : (
                      initials(t.creator?.username)
                    )}
                  </div>

                  <div>
                    <div className="font-extrabold text-slate-900">
                      {t.origin} → {t.destination}
                    </div>
                    <div className="text-xs font-bold text-slate-600">
                      {new Date(t.date).toLocaleDateString("es-ES")}{" "}
                      {t.time ? `· ${t.time}` : ""}
                    </div>
                    <div className="text-xs font-bold text-slate-500 mt-1">
                      {t.team} · {t.match}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-black text-slate-900">
                    {(t.priceCents / 100).toFixed(2)} €
                  </div>
                  <div className="text-xs font-bold text-slate-600">
                    {t.seatsAvailable} / {t.seatsTotal} plazas
                  </div>
                </div>
              </CardBody>
            </Card>
          </Link>
        ))}

        {!missing && trips.length === 0 && (
          <div className="mt-3 text-slate-600">No hay viajes con esos criterios.</div>
        )}
      </div>
    </Page>
  );
}
