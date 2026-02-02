import nodemailer from "nodemailer";
import { env } from "@/lib/env";

function hasSMTP() {
  return !!(env.SMTP_HOST && env.SMTP_USER && env.SMTP_PASS);
}

export function getTransport() {
  if (!hasSMTP()) return null;

  const port = env.SMTP_PORT ? Number(env.SMTP_PORT) : 587;
  const secure = env.SMTP_SECURE === "true";

  return nodemailer.createTransport({
    host: env.SMTP_HOST,
    port,
    secure,
    auth: {
      user: env.SMTP_USER!,
      pass: env.SMTP_PASS!,
    },
  });
}

function logoDataUri() {
  // Inline SVG data URI (simple + compatible).
  const svg = encodeURIComponent(`<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="140" height="34" viewBox="0 0 180 44" fill="none">
  <defs><linearGradient id="g" x1="0" y1="0" x2="180" y2="44" gradientUnits="userSpaceOnUse">
    <stop stop-color="#111827"/><stop offset="1" stop-color="#0F172A"/></linearGradient></defs>
  <rect x="2" y="2" width="40" height="40" rx="14" fill="url(#g)"/>
  <path d="M14 27c0-6.2 4.9-11.3 11.4-11.3 3 0 5.5.8 7.6 2.4l-3.1 3.2a7.5 7.5 0 0 0-4.5-1.4c-3.9 0-6.9 2.9-6.9 7.1s3 7.1 6.9 7.1c1.8 0 3.4-.5 4.7-1.5v-2.8h-5.2v-4h9.7v9.1c-2.5 2.2-5.6 3.4-9.2 3.4-6.5 0-11.4-5-11.4-11.3Z" fill="#fff"/>
  <text x="54" y="28" font-family="ui-sans-serif, system-ui" font-size="20" font-weight="700" fill="#111827">GolRide</text>
</svg>`);
  return `data:image/svg+xml;charset=utf-8,${svg}`;
}

function wrapHtml(title: string, body: string) {
  const logo = logoDataUri();
  return `
  <div style="font-family: ui-sans-serif,system-ui,Segoe UI,Roboto,Arial; background:#f4f4f5; padding:24px;">
    <div style="max-width:560px; margin:0 auto; background:#fff; border-radius:16px; overflow:hidden; border:1px solid #e4e4e7;">
      <div style="padding:18px 22px; border-bottom:1px solid #e4e4e7;">
        <img src="${logo}" alt="GolRide" height="34" />
      </div>
      <div style="padding:22px;">
        <h2 style="margin:0 0 10px; font-size:18px; color:#111827;">${title}</h2>
        <div style="color:#374151; font-size:14px; line-height:1.55;">
          ${body}
        </div>
      </div>
      <div style="padding:16px 22px; border-top:1px solid #e4e4e7; color:#6b7280; font-size:12px;">
        GolRide · viajes para ir a ver a tu equipo
      </div>
    </div>
  </div>`;
}

export async function sendEmail(to: string, subject: string, html: string) {
  const transporter = getTransport();
  if (!transporter) {
    // En desarrollo sin SMTP, logueamos para que puedas ver el contenido.
    // eslint-disable-next-line no-console
    console.log("[EMAIL MOCK]", { to, subject, html });
    return;
  }
  await transporter.sendMail({
    from: env.SMTP_FROM ?? env.SMTP_USER!,
    to,
    subject,
    html,
  });
}

export async function sendVerificationCodeEmail(to: string, code: string) {
  const html = wrapHtml(
    "Verifica tu cuenta",
    `<p>Tu código de verificación es:</p>
     <p style="font-size:28px; letter-spacing:4px; font-weight:700; margin:10px 0; color:#111827;">${code}</p>
     <p>Este código caduca en 15 minutos.</p>`
  );
  await sendEmail(to, "GolRide · Código de verificación", html);
}

export async function sendWelcomeEmail(to: string) {
  const html = wrapHtml(
    "¡Registro completado!",
    `<p>Bienvenido/a a GolRide. Ya puedes buscar viajes, reservar y publicar los tuyos.</p>`
  );
  await sendEmail(to, "GolRide · Bienvenido/a", html);
}

export async function sendTripPublishedEmail(to: string, tripUrl: string) {
  const html = wrapHtml(
    "Viaje publicado",
    `<p>Tu viaje se ha publicado correctamente.</p>
     <p><a href="${tripUrl}" style="color:#111827;">Ver tu viaje</a></p>
     <p>Puedes compartir este enlace por WhatsApp o donde quieras.</p>`
  );
  await sendEmail(to, "GolRide · Confirmación de publicación", html);
}

export async function sendReservationEmail(to: string, tripUrl: string) {
  const html = wrapHtml(
    "Reserva confirmada",
    `<p>Tu reserva se ha confirmado tras el pago.</p>
     <p><a href="${tripUrl}" style="color:#111827;">Ver detalles del viaje</a></p>`
  );
  await sendEmail(to, "GolRide · Reserva confirmada", html);
}
