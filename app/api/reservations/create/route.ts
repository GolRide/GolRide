import { NextResponse } from "next/server";
import { requireSession } from "@/lib/auth";
import { dbConnect } from "@/lib/db";
import { Reservation } from "@/models/Reservation";
import { Trip } from "@/models/Trip";
import { getStripe } from "@/lib/stripe";
import { absoluteUrl } from "@/lib/url";

export async function POST(req: Request) {
  const session = requireSession();
  const form = await req.formData();
  const tripId = String(form.get("tripId") || "");

  await dbConnect();
  const trip: any = await Trip.findById(tripId);
  if (!trip || !trip.active) return NextResponse.redirect(new URL("/", req.url));
  if (String(trip.creatorId) === session.userId) return NextResponse.redirect(new URL(`/trips/${tripId}`, req.url));
  if (trip.seatsAvailable < 1) return NextResponse.redirect(new URL(`/trips/${tripId}?error=full`, req.url));

  // If a reservation exists, reuse it
  let reservation: any = await Reservation.findOne({ tripId, userId: session.userId });
  if (!reservation) {
    reservation = await Reservation.create({ tripId, userId: session.userId, status: "pending" });
  } else if (reservation.status === "paid") {
    return NextResponse.redirect(new URL(`/trips/${tripId}`, req.url));
  }

  const stripe = getStripe();

  const successUrl = absoluteUrl(`/checkout/success?tripId=${tripId}`);
  const cancelUrl = absoluteUrl(`/checkout/cancel?tripId=${tripId}`);

  const sess = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: "eur",
          unit_amount: trip.priceCents,
          product_data: {
            name: `GolRide · ${trip.origin} → ${trip.destination}`,
            description: `Equipo: ${trip.team} · Partido: ${trip.match}`,
          },
        },
      },
    ],
    metadata: {
      reservationId: String(reservation._id),
      tripId: String(trip._id),
      buyerUserId: session.userId,
    },
    success_url: successUrl,
    cancel_url: cancelUrl,
  });

  reservation.stripeSessionId = sess.id;
  await reservation.save();

  return NextResponse.redirect(sess.url!);
}
