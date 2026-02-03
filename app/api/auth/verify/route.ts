import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import User from "@/models/User";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const email = String(body?.email || "").trim().toLowerCase();
    const code = String(body?.code || "").trim();

    if (!email || !code) {
      return NextResponse.json({ error: "Faltan datos" }, { status: 400 });
    }

    await dbConnect();

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ error: "Usuario no existe" }, { status: 404 });
    }

    if (user.verified) {
      return NextResponse.json({ ok: true, message: "Ya verificado" });
    }

    if (!user.verificationCode || !user.verificationExpiresAt) {
      return NextResponse.json({ error: "No hay código activo" }, { status: 400 });
    }

    if (new Date(user.verificationExpiresAt).getTime() < Date.now()) {
      return NextResponse.json({ error: "Código caducado" }, { status: 400 });
    }

    if (String(user.verificationCode) !== String(code)) {
      return NextResponse.json({ error: "Código incorrecto" }, { status: 400 });
    }

    user.verified = true;
    user.verificationCode = undefined;
    user.verificationExpiresAt = undefined;
    await user.save();

    return NextResponse.json({ ok: true, message: "Email verificado ✅" });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Error verificando" }, { status: 500 });
  }
}
