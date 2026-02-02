import Stripe from "stripe";
import { env } from "@/lib/env";

export function getStripe() {
  if (!env.STRIPE_SECRET_KEY) throw new Error("STRIPE_SECRET_KEY no configurada");
  return new Stripe(env.STRIPE_SECRET_KEY, { apiVersion: "2024-06-20" });
}
