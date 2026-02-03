"use client";

import { useRouter } from "next/navigation";

export default function RefreshButton() {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={() => {
        router.replace("/dashboard/active-trips");
        router.refresh();
      }}
      className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2 font-extrabold text-slate-900 hover:bg-slate-50"
      title="Actualizar"
      aria-label="Actualizar"
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M21 12a9 9 0 0 1-15.3 6.36"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M3 12a9 9 0 0 1 15.3-6.36"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M6 18l-1.5.36L4.5 17"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M18 6l1.5-.36L19.5 7"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      Actualizar
    </button>
  );
}
