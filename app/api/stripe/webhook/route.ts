import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { env } from "@/lib/env";
import { getStripe } from "@/lib/stripe";
import { dbConnect } from "@/lib/db";
import { Reservation } from "@/models/Reservation";
import { Trip } from "@/models/Trip";
import User from "@/models/User";
import { absoluteUrl } from "@/lib/url";
import { sendReservationEmail } from "@/lib/email";

export const runtime = "nodejs";

export async function POST(req: Request) {
  if (!env.STRIPE_WEBHOOK_SECRET) {
    return new NextResponse("Stripe webhook secret not set", { status: 400 });
  }

  const stripe = getStripe();
  const sig = headers().get("stripe-signature");
  if (!sig) return new NextResponse("Missing signature", { status: 400 });

  const body = await req.text();

  let event: any;
  try {
    event = stripe.webhooks.constructEvent(body, sig, env.STRIPE_WEBHOOK_SECRET);
  } catch (err: any) {
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const reservationId = session?.metadata?.reservationId;

    if (reservationId) {
      await dbConnect();

      const reservation: any = await Reservation.findById(reservationId);
      if (reservation && reservation.status !== "paid") {
        reservation.status = "paid";
        await reservation.save();

        const trip: any = await Trip.findById(reservation.tripId);
        if (trip && trip.seatsAvailable > 0) {
          trip.seatsAvailable = Math.max(0, trip.seatsAvailable - 1);
          await trip.save();
        }

        // send confirmation email to buyer
        const buyer: any = await User.findById(reservation.userId).lean();
        const tripUrl = absoluteUrl(`/trips/${reservation.tripId}`);
        if (buyer?.email) await sendReservationEmail(buyer.email, tripUrl);
      }
    }
  }

  return NextResponse.json({ received: true });
}
