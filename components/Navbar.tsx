import Link from "next/link";

export function Navbar({ isAuthed }: { isAuthed: boolean }) {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="relative mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        {/* Logo izquierda */}
        <Link
          href="/"
          className="text-[20px] font-black tracking-tight text-slate-900 hover:opacity-90"
        >
          GolRide
        </Link>

        {/* Slogan centrado */}
        <div className="pointer-events-none absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 md:block">
          <Link
            href="/"
            className="pointer-events-auto text-[14px] font-black tracking-[0.10em] text-slate-900 hover:opacity-90"
          >
            RUMBO AL ESTADIO.
          </Link>
        </div>

        {/* Botones derecha */}
        <nav className="flex items-center gap-2">
          {isAuthed ? (
            <>
              <Link
                href="/dashboard/profile"
                className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-[15px] font-black text-slate-900 hover:bg-slate-50"
              >
                Mi perfil
              </Link>

              <a
                href="/api/auth/logout"
                className="rounded-xl bg-slate-900 px-4 py-2 text-[15px] font-black text-white hover:bg-slate-800"
              >
                Salir
              </a>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-[15px] font-black text-slate-900 hover:bg-slate-50"
              >
                Inicia sesión
              </Link>

              <Link
                href="/register"
                className="rounded-xl bg-slate-900 px-4 py-2 text-[15px] font-black text-white hover:bg-slate-800"
              >
                Regístrate
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
