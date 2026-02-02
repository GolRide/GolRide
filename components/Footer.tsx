export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t">
      <div className="mx-auto max-w-6xl px-4 py-10 text-sm text-zinc-600">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <p>© {year} GolRide</p>
          <p className="text-zinc-500">Viajes para ir a ver a tu equipo · Coche o bus</p>
        </div>
      </div>
    </footer>
  );
}
