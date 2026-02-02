import { env } from "@/lib/env";

export function absoluteUrl(path: string) {
  const base = env.NEXT_PUBLIC_BASE_URL.replace(/\/$/, "");
  return `${base}${path.startsWith("/") ? "" : "/"}${path}`;
}
