"use client";

import { useRouter } from "next/navigation";

export default function GoToActiveTripsButton({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) {
  const router = useRouter();

  return (
    <button
      type="button"
      className={className}
      onClick={() => {
        router.replace("/dashboard/active-trips");
        router.refresh();
      }}
    >
      {children ?? "Ver viajes"}
    </button>
  );
}
