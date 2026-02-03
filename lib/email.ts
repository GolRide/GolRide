import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

function pickRecipient(requestedTo: string) {
  const allowed = (process.env.RESEND_ALLOWED_TO || "").trim().toLowerCase();
  const to = requestedTo.trim().toLowerCase();

  if (process.env.NODE_ENV === "production") return to;
  return allowed || to;
}

export async function sendVerificationCodeEmail(to: string, code: string) {
  if (!process.env.RESEND_API_KEY) throw new Error("RESEND_API_KEY missing");

  const from = process.env.EMAIL_FROM || "GolRide <onboarding@resend.dev>";
  const finalTo = pickRecipient(to);

  const { error } = await resend.emails.send({
    from,
    to: finalTo,
    subject: "Tu código de verificación - GolRide",
    html: `
      <div style="font-family:Arial,sans-serif;line-height:1.4">
        <h2>Verifica tu correo</h2>
        <p>Cuenta registrada con: <b>${to}</b></p>
        <p>Tu código es:</p>
        <div style="font-size:28px;font-weight:700;letter-spacing:6px;margin:16px 0">${code}</div>
        <p>Caduca en <b>15 minutos</b>.</p>
      </div>
    `,
  });

  if (error) throw new Error(error.message);
}

export async function sendPasswordResetEmail(to: string, resetUrl: string) {
  if (!process.env.RESEND_API_KEY) throw new Error("RESEND_API_KEY missing");

  const from = process.env.EMAIL_FROM || "GolRide <onboarding@resend.dev>";
  const finalTo = pickRecipient(to);

  const { error } = await resend.emails.send({
    from,
    to: finalTo,
    subject: "Restablecer contraseña - GolRide",
    html: `
      <div style="font-family:Arial,sans-serif;line-height:1.4">
        <h2>Restablecer contraseña</h2>
        <p>Solicitud para: <b>${to}</b></p>
        <p>Pulsa aquí para restablecer tu contraseña:</p>
        <p><a href="${resetUrl}" style="display:inline-block;padding:10px 14px;background:#000;color:#fff;border-radius:10px;text-decoration:none">Restablecer contraseña</a></p>
        <p>Si no has sido tú, ignora este email.</p>
      </div>
    `,
  });

  if (error) throw new Error(error.message);
}
