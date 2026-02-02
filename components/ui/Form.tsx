import React from "react";

export function Label({ children }: { children: React.ReactNode }) {
  return <label className="text-sm font-extrabold text-slate-800">{children}</label>;
}

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={
        "mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-slate-900 outline-none " +
        "placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
      }
    />
  );
}

export function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className={
        "mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-slate-900 outline-none " +
        "focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
      }
    />
  );
}

export function HelperText({ children }: { children: React.ReactNode }) {
  return <div className="mt-1 text-xs text-slate-500">{children}</div>;
}
