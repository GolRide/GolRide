import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import User from "@/models/User";
import { createSessionToken, setSessionCookie } from "@/lib/auth";
import { sendWelcomeEmail } from "@/lib/email";

export async function POST(req: Request) {
  const form = await req.formData();
  const email = String(form.get("email") || "").trim().toLowerCase();
  const code = String(form.get("code") || "").trim();

  await dbConnect();
  const user: any = await User.findOne({ email });
  if (!user) return NextResponse.redirect(new URL("/verify?error=not_found", req.url));

  const exp = user.verificationExpiresAt ? new Date(user.verificationExpiresAt).getTime() : 0;
  const now = Date.now();
  if (user.verified) {
    const token = createSessionToken({ userId: String(user._id), email: user.email, username: user.username, verified: true });
    setSessionCookie(token);
    return NextResponse.redirect(new URL("/dashboard/profile", req.url));
  }

  if (!user.verificationCode || user.verificationCode !== code || (exp && now > exp)) {
    return NextResponse.redirect(new URL(`/verify?email=${encodeURIComponent(email)}&error=invalid`, req.url));
  }

  user.verified = true;
  user.verificationCode = "";
  await user.save();

try {
  await sendWelcomeEmail(user.email, user.name);
} catch (e) {
  console.error("[SMTP] Fallo enviando bienvenida:", e);
}

  const token = createSessionToken({ userId: String(user._id), email: user.email, username: user.username, verified: true });
  setSessionCookie(token);

  return NextResponse.redirect(new URL("/dashboard/profile", req.url));
}
