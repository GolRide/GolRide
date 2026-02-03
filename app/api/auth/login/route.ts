import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import { verifyPassword } from "@/lib/auth";

export async function POST(req: Request) {
  await connectDB();

  let email = "";
  let password = "";

  const contentType = req.headers.get("content-type");

  if (contentType?.includes("application/json")) {
    const body = await req.json();
    email = String(body.email || "");
    password = String(body.password || "");
  } else {
    const formData = await req.formData();
    email = String(formData.get("email") || "");
    password = String(formData.get("password") || "");
  }

  email = email.trim().toLowerCase();
  password = password || "";

  if (!email || !password) {
    return NextResponse.json({ error: "Missing credentials" }, { status: 400 });
  }

  const user = await User.findOne({ email });

  if (!user) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const ok = await verifyPassword(password, user.passwordHash);
  if (!ok) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const token = jwt.sign(
    { userId: user._id.toString() },
    process.env.JWT_SECRET!,
    { expiresIn: "7d" }
  );

  const res = NextResponse.json({ ok: true });

  res.cookies.set("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  return res;
}
