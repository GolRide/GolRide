import "@/models/User";
import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import { Trip } from "@/models/Trip";
import { getSession } from "@/lib/auth";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const origin = (searchParams.get("origin") || "").trim();
  const destination = (searchParams.get("destination") || "").trim();
  const team = (searchParams.get("team") || "").trim();
  const dateStr = (searchParams.get("date") || "").trim();

  await dbConnect();

  const filter: any = { active: true };

  if (origin) filter.origin = new RegExp(origin, "i");
  if (destination) filter.destination = new RegExp(destination, "i");
  if (team) filter.team = new RegExp(team, "i");

  if (dateStr) {
    const start = new Date(dateStr);
    if (!Number.isNaN(start.getTime())) {
      const end = new Date(start);
      end.setUTCDate(end.getUTCDate() + 1);
      filter.date = { $gte: start, $lt: end };
    }
  }

  const trips = await Trip.find(filter)
    .sort({ date: 1 })
    .limit(100)
    .populate("creatorId", "username avatar")
    .lean();

  const shaped = trips.map((t: any) => ({
    _id: String(t._id),
    origin: t.origin,
    destination: t.destination,
    date: t.date,
    time: t.time || "",
    time: t.time || "",
    match: t.match,
    team: t.team,
    seatsAvailable: t.seatsAvailable,
    seatsTotal: t.seatsTotal,
    priceCents: t.priceCents,
    contactPreference: t.contactPreference,
    meetingPoint,
    meetingPoint: t.meetingPoint || "",
    creator: {
      username: t.creatorId?.username || "Usuario",
      avatar: t.creatorId?.avatar || "",
    },
  }));

  return NextResponse.json({ trips: shaped });
}

export async function POST(req: Request) {
  await dbConnect();

  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "unauthenticated" }, { status: 401 });
  }

  let body: any = {};
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const origin = String(body.origin || "").trim();
  const destination = String(body.destination || "").trim();
  const match = String(body.match || "").trim();
  const team = String(body.team || "").trim();
  const dateStr = String(body.date || "").trim();

  // ✅ NUEVO
  const time = String(body.time || "").trim(); // "HH:mm"
  const meetingPoint = String(body.meetingPoint || "").trim(); // opcional

  const contactPreference = String(body.contactPreference || "").trim();
  const priceCents = Number(body.priceCents);
  const seatsTotal = Number(body.seatsTotal);

  if (!origin || !destination || !match || !team || !dateStr || !time) {
    return NextResponse.json({ error: "missing_fields" }, { status: 400 });
  }

  if (!/^\d{2}:\d{2}$/.test(time)) {
    return NextResponse.json({ error: "invalid_time" }, { status: 400 });
  }

  if (!Number.isFinite(seatsTotal) || seatsTotal < 1 || seatsTotal > 60) {
    return NextResponse.json({ error: "invalid_seatsTotal" }, { status: 400 });
  }

  if (!Number.isFinite(priceCents) || priceCents < 0 || priceCents > 50000) {
    return NextResponse.json({ error: "invalid_priceCents" }, { status: 400 });
  }

  if (contactPreference !== "whatsapp" && contactPreference !== "email") {
    return NextResponse.json({ error: "invalid_contactPreference" }, { status: 400 });
  }

  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) {
    return NextResponse.json({ error: "invalid_date" }, { status: 400 });
  }

  // Bloquear fechas pasadas (día completo)
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const tripDay = new Date(date);
  tripDay.setHours(0, 0, 0, 0);

  if (tripDay < today) {
    return NextResponse.json({ error: "date_in_past" }, { status: 400 });
  }

  const doc = await Trip.create({
    creatorId: session.userId,
    origin,
    destination,
    date,
    time,
    match,
    team,
    seatsTotal,
    seatsAvailable: seatsTotal,
    priceCents,
    contactPreference,
    meetingPoint, // opcional
    active: true,
  });

  return NextResponse.json({ ok: true, id: String(doc._id) }, { status: 201 });
}
