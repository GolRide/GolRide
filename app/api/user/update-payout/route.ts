import { NextResponse } from "next/server";
import { requireSession } from "@/lib/auth";
import { dbConnect } from "@/lib/db";
import User from "@/models/User";

export async function POST(req: Request) {
  const session = requireSession();
  const form = await req.formData();
  const payoutIban = String(form.get("payoutIban") || "").trim();

  await dbConnect();
  await User.updateOne({ _id: session.userId }, { $set: { payoutIban } });

  return NextResponse.redirect(new URL("/dashboard/payments?saved=1", req.url));
}
