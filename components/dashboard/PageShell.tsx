import { Sidebar } from "@/components/dashboard/Sidebar";

export function PageShell({ current, children }: { current: string; children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <Sidebar current={current} />
        <div>{children}</div>
      </div>
    </div>
  );
}
