import nodemailer from "nodemailer";
import "dotenv/config";

const to = process.argv[2];
if (!to) {
  console.log("Uso:");
  console.log("  node scripts/test-ionos-email.mjs TU_EMAIL@EJEMPLO.COM");
  process.exit(1);
}

const host = process.env.SMTP_HOST;
const port = Number(process.env.SMTP_PORT || 587);
const secure = String(process.env.SMTP_SECURE).toLowerCase() === "true";
const user = process.env.SMTP_USER;
const pass = process.env.SMTP_PASS;
const from = process.env.SMTP_FROM || user;

if (!host || !user || !pass) {
  console.error("Faltan env vars: SMTP_HOST / SMTP_USER / SMTP_PASS");
  process.exit(1);
}

const transporter = nodemailer.createTransport({
  host,
  port,
  secure,               // false para 587 (STARTTLS)
  auth: { user, pass },
  requireTLS: true,     // fuerza STARTTLS
  tls: { minVersion: "TLSv1.2" },
});

try {
  await transporter.verify();
  console.log("✅ SMTP verify OK");

  const info = await transporter.sendMail({
    from,               // IMPORTANTE: debe ser del mismo buzón que autentica (info@golride.com)
    to,
    subject: "Test GolRide (IONOS SMTP)",
    text: "Si lees esto, IONOS SMTP funciona correctamente.",
  });

  console.log("✅ Email enviado");
  console.log(info);
} catch (e) {
  console.error("❌ Error SMTP:");
  console.error(e && e.response ? e.response : e);
  process.exit(1);
}
