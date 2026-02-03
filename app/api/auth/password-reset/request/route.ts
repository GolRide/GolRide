import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import User from "@/models/User";
import { generateResetToken } from "@/lib/reset";
import { sendPasswordResetEmail } from "@/lib/email";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const email = String(body?.email || "").trim().toLowerCase();

    // Siempre respondemos OK para no filtrar si existe o no
    if (!email) {
      return NextResponse.json({ ok: true });
    }

    await dbConnect();
    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json({ ok: true });
    }

    const { token, tokenHash } = generateResetToken();
    user.resetPasswordTokenHash = tokenHash;
    user.resetPasswordExpiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hora
    await user.save();

    const base = process.env.NEXT_PUBLIC_BASE_URL || process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
    const resetUrl = `${base}/reset-password?email=${encodeURIComponent(email)}&token=${encodeURIComponent(token)}`;

    try {
      await sendPasswordResetEmail(email, resetUrl);
    } catch (e) {
      console.error("[EMAIL] Fallo enviando reset:", e);
      // no reventamos
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ ok: true });
  }
}
