import React from "react";

export function Page({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-[calc(100vh-64px)] bg-slate-50 text-slate-900">
      <div className="mx-auto w-full max-w-6xl px-4 py-6">{children}</div>
    </main>
  );
}
