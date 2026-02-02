import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import { requireSession, signPassword } from "@/lib/auth";
import User from "@/models/User";

export async function POST(req: Request) {
  const session = requireSession();
  const form = await req.formData();

  const patch: any = {
    username: String(form.get("username") || "").trim(),
    team: String(form.get("team") || "").trim(),
    name: String(form.get("name") || "").trim(),
    surnames: String(form.get("surnames") || "").trim(),
    phone: String(form.get("phone") || "").trim(),
    email: String(form.get("email") || "").trim().toLowerCase(),
    contactMethod: String(form.get("contactMethod") || "whatsapp"),
  };

  const newPassword = String(form.get("newPassword") || "");

  await dbConnect();

  // Avoid collisions with other users
  const collision = await User.findOne({
    _id: { $ne: session.userId },
    $or: [{ email: patch.email }, { username: patch.username }],
  }).lean();

  if (collision) {
    return NextResponse.redirect(new URL("/dashboard/profile?error=exists", req.url));
  }

  if (newPassword && newPassword.length >= 8) {
    patch.passwordHash = await signPassword(newPassword);
  }

  await User.updateOne({ _id: session.userId }, { $set: patch });
  return NextResponse.redirect(new URL("/dashboard/profile?saved=1", req.url));
}
