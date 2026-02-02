import "@/models/User";
import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import { Trip } from "@/models/Trip";

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  await dbConnect();

  const t: any = await Trip.findById(params.id)
    .populate("creatorId", "username avatar")
    .lean();

  if (!t) return NextResponse.json({ error: "not_found" }, { status: 404 });

  return NextResponse.json({
    _id: String(t._id),
    origin: t.origin,
    destination: t.destination,
    date: t.date,
    match: t.match,
    team: t.team,
    seatsTotal: t.seatsTotal,
    seatsAvailable: t.seatsAvailable,
    priceCents: t.priceCents,
    contactPreference: t.contactPreference,
    active: t.active,
    createdAt: t.createdAt,
    updatedAt: t.updatedAt,
    creator: {
      username: t.creatorId?.username || "Usuario",
      avatar: t.creatorId?.avatar || "",
    },
  });
}
