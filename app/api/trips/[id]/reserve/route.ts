import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import { Trip } from "@/models/Trip";
import "@/models/User";
import { getSession } from "@/lib/auth";

export async function POST(_req: Request, { params }: { params: { id: string } }) {
  await dbConnect();

  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "unauthenticated" }, { status: 401 });
  }

  const trip: any = await Trip.findById(params.id).lean();
  if (!trip) {
    return NextResponse.json({ error: "Trip not found" }, { status: 404 });
  }

  if (String(trip.creatorId) === String(session.userId)) {
    return NextResponse.json({ error: "No puedes reservar tu propio viaje" }, { status: 400 });
  }

  const updated = await Trip.findOneAndUpdate(
    { _id: params.id, seatsAvailable: { $gt: 0 } },
    { $inc: { seatsAvailable: -1 } },
    { new: true }
  ).lean();

  if (!updated) {
    return NextResponse.json({ error: "No quedan plazas disponibles" }, { status: 400 });
  }

  return NextResponse.json({
    ok: true,
    seatsAvailable: updated.seatsAvailable,
    seatsTotal: updated.seatsTotal,
  });
}
