export default function NotFound() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-14">
      <h1 className="text-2xl font-semibold">No encontrado</h1>
      <p className="mt-2 text-zinc-700">La página que buscas no existe.</p>
      <a className="mt-4 inline-block font-medium" href="/">Volver al inicio</a>
    </div>
  );
}
