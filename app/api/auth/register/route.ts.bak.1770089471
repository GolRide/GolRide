import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import User from "@/models/User";
import { signPassword } from "@/lib/auth";
import { generateCode, expiresInMinutes } from "@/lib/verify";
import { sendVerificationCodeEmail } from "@/lib/email";

export async function POST(req: Request) {
  const form = await req.formData();
  const username = String(form.get("username") || "").trim();
  const name = String(form.get("name") || "").trim();
  const surnames = String(form.get("surnames") || "").trim();
  const team = String(form.get("team") || "").trim();
  const phone = String(form.get("phone") || "").trim();
  const email = String(form.get("email") || "").trim().toLowerCase();
  const contactMethod = String(form.get("contactMethod") || "whatsapp");
    const accountType = String(form.get("accountType") || "particular");
  const password = String(form.get("password") || "");

  if (!username || !name || !surnames || !phone || !email || !password) {
    return NextResponse.redirect(new URL("/register?error=missing", req.url));
  }
  if (password.length < 8) {
    return NextResponse.redirect(new URL("/register?error=weak_password", req.url));
  }

  await dbConnect();

  const exists = await User.findOne({ $or: [{ email }, { username }] }).lean();
  if (exists) {
    return NextResponse.redirect(new URL("/register?error=exists", req.url));
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
  // NO reventamos el registro por fallo SMTP
}

  const url = new URL("/verify", req.url);
  url.searchParams.set("email", email);
  return NextResponse.redirect(url);
}
