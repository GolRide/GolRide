export function Section({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mx-auto max-w-6xl px-4 py-14">
      <div className="max-w-3xl">
        <h2 className="text-3xl font-semibold tracking-tight">{title}</h2>
        {subtitle ? <p className="mt-3 text-zinc-700">{subtitle}</p> : null}
      </div>
      <div className="mt-10">{children}</div>
    </section>
  );
}
