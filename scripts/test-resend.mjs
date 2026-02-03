import "dotenv/config";
import { Resend } from "resend";

const to = process.argv[2];
if (!to) {
  console.log("Uso: node scripts/test-resend.mjs TU_EMAIL@EJEMPLO.COM");
  process.exit(1);
}

if (!process.env.RESEND_API_KEY) {
  console.log("Falta RESEND_API_KEY en .env / .env.local");
  process.exit(1);
}

const resend = new Resend(process.env.RESEND_API_KEY);

const { error, data } = await resend.emails.send({
  from: process.env.EMAIL_FROM || "GolRide <onboarding@resend.dev>",
  to,
  subject: "Test GolRide (Resend)",
  html: "<p>Si lees esto, Resend funciona ✅</p>",
});

if (error) {
  console.error("❌ Error Resend:", error);
  process.exit(1);
}

console.log("✅ Enviado:", data);
