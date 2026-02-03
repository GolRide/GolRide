import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import User from "@/models/User";
import { signPassword } from "@/lib/auth";
import { generateCode, expiresInMinutes } from "@/lib/verify";
import { sendVerificationCodeEmail } from "@/lib/email";

function redirectRegister(req: Request, flags: { u?: boolean; e?: boolean; p?: boolean; error?: string; next?: string }) {
  const url = new URL("/register", req.url);
  if (flags.error) url.searchParams.set("error", flags.error);
  if (flags.u) url.searchParams.set("u", "1"); // username tomado
  if (flags.e) url.searchParams.set("e", "1"); // email tomado
  if (flags.p) url.searchParams.set("p", "1"); // phone tomado
  if (flags.next) url.searchParams.set("next", flags.next);
  return NextResponse.redirect(url);
}

export async function POST(req: Request) {
  const form = await req.formData();

  const next = String(form.get("next") || "").trim();

  const username = String(form.get("username") || "").trim();
  const name = String(form.get("name") || "").trim();
  const surnames = String(form.get("surnames") || "").trim();
  const team = String(form.get("team") || "").trim(); // OPCIONAL
  const phone = String(form.get("phone") || "").trim();
  const email = String(form.get("email") || "").trim().toLowerCase();
  const contactMethod = String(form.get("contactMethod") || "whatsapp");
  const accountType = String(form.get("accountType") || "particular");
  const password = String(form.get("password") || "");

  // team NO es obligatorio
  if (!username || !name || !surnames || !phone || !email || !password) {
    return redirectRegister(req, { error: "missing", next });
  }
  if (password.length < 8) {
    return redirectRegister(req, { error: "weak_password", next });
  }

  await dbConnect();

  // Comprobación granular para poder mostrar el mensaje debajo del campo correcto
  const [emailUser, usernameUser, phoneUser] = await Promise.all([
    User.findOne({ email }),
    User.findOne({ username }),
    User.findOne({ phone }),
  ]);

  // Si el email existe pero NO está verificado => reenvía código y manda a /verify
  if (emailUser && emailUser.verified === false) {
    const code = generateCode(6);
    console.log("[DEV] Reenvío código de verificación para", email, "=>", code);

    emailUser.verificationCode = code;
    emailUser.verificationExpiresAt = expiresInMinutes(15);
    await emailUser.save();

    try {
      await sendVerificationCodeEmail(email, code);
    } catch (e) {
      console.error("[SMTP] Fallo reenviando verificación:", e);
    }

    const url = new URL("/verify", req.url);
    url.searchParams.set("email", email);
    if (next) url.searchParams.set("next", next);
    return NextResponse.redirect(url);
  }

  // Si ya existe verificado, o username/phone existen, devolvemos flags para UI
  const anyConflict = Boolean(emailUser || usernameUser || phoneUser);
  if (anyConflict) {
    return redirectRegister(req, {
      u: Boolean(usernameUser),
      e: Boolean(emailUser),
      p: Boolean(phoneUser),
      error: "exists",
      next,
    });
  }

  const code = generateCode(6);
  console.log("[DEV] Código de verificación para", email, "=>", code);

  const passwordHash = await signPassword(password);

  await User.create({
    username,
    accountType,
    name,
    surnames,
    team,
    phone,
    email,
    contactMethod,
    passwordHash,
    verified: false,
    verificationCode: code,
    verificationExpiresAt: expiresInMinutes(15),
  });

  try {
    await sendVerificationCodeEmail(email, code);
  } catch (e) {
    console.error("[SMTP] Fallo enviando verificación:", e);
  }

  const url = new URL("/verify", req.url);
  url.searchParams.set("email", email);
  if (next) url.searchParams.set("next", next);
  return NextResponse.redirect(url);
}
