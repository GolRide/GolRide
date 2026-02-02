import { Schema, model, models } from "mongoose";

const ReservationSchema = new Schema(
  {
    tripId: { type: Schema.Types.ObjectId, ref: "Trip", required: true, index: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    status: { type: String, enum: ["pending", "paid", "cancelled"], default: "pending" },
    stripeSessionId: { type: String, default: "" },
  },
  { timestamps: true }
);

export const Reservation = models.Reservation || model("Reservation", ReservationSchema);
