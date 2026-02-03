import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendVerificationEmail(to: string, code: string) {
  if (!process.env.RESEND_API_KEY) {
    throw new Error("RESEND_API_KEY missing");
  }

  const from = process.env.EMAIL_FROM || "GolRide <onboarding@resend.dev>";

  const { error } = await resend.emails.send({
    from,
    to,
    subject: "Tu código de verificación - GolRide",
    html: `
      <div style="font-family:Arial,sans-serif;line-height:1.4">
        <h2>Verifica tu correo</h2>
        <p>Tu código es:</p>
        <div style="font-size:28px;font-weight:700;letter-spacing:6px;margin:16px 0">${code}</div>
        <p>Caduca en <b>10 minutos</b>.</p>
      </div>
    `,
  });

  if (error) throw new Error(error.message);
}
