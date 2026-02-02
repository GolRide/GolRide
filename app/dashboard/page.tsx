import Link from "next/link";

export default function DashboardHome() {
  return (
    <div className="space-y-2">
      <h1 className="text-3xl font-black tracking-tight text-slate-900">Mi perfil</h1>

      <p className="text-slate-700">
        Bienvenido a tu panel de GolRide.
      </p>

      <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="text-sm font-extrabold text-slate-900">“El fútbol es la cosa más importante de las cosas menos importantes.”</div>
        <div className="mt-1 text-xs text-slate-500">— Arrigo Sacchi</div>
      </div>

      <div className="pt-2">
        <Link
          href="/trips/new"
          className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-4 py-2 font-extrabold text-white hover:bg-slate-800"
        >
          Publicar viaje
        </Link>
      </div>
    </div>
  );
}
