import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import User from "@/models/User";
import { hashResetToken } from "@/lib/reset";
import { signPassword } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const email = String(body?.email || "").trim().toLowerCase();
    const token = String(body?.token || "").trim();
    const password = String(body?.password || "");
    const password2 = String(body?.password2 || "");

    if (!email || !token || !password || !password2) {
      return NextResponse.json({ error: "Faltan datos" }, { status: 400 });
    }
    if (password.length < 8) {
      return NextResponse.json({ error: "La contraseña debe tener al menos 8 caracteres" }, { status: 400 });
    }
    if (password !== password2) {
      return NextResponse.json({ error: "Las contraseñas no coinciden" }, { status: 400 });
    }

    await dbConnect();
    const user = await User.findOne({ email });
    if (!user || !user.resetPasswordTokenHash || !user.resetPasswordExpiresAt) {
      return NextResponse.json({ error: "Enlace inválido" }, { status: 400 });
    }

    if (new Date(user.resetPasswordExpiresAt).getTime() < Date.now()) {
      return NextResponse.json({ error: "Enlace caducado" }, { status: 400 });
    }

    const tokenHash = hashResetToken(token);
    if (tokenHash !== String(user.resetPasswordTokenHash)) {
      return NextResponse.json({ error: "Enlace inválido" }, { status: 400 });
    }

    user.passwordHash = await signPassword(password);
    user.resetPasswordTokenHash = undefined;
    user.resetPasswordExpiresAt = undefined;
    await user.save();

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Error" }, { status: 500 });
  }
}
