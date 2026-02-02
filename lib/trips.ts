export type TripLike = {
  date: string | Date;
  time?: string;
};

export function getDepartureDate(trip: TripLike) {
  const base = new Date(trip.date);
  if (trip.time) {
    const [hours, minutes] = trip.time.split(":").map((part) => Number(part));
    if (!Number.isNaN(hours) && !Number.isNaN(minutes)) {
      base.setHours(hours, minutes, 0, 0);
    }
  }
  return base;
}

export function sortTripsByDeparture<T extends TripLike>(a: T, b: T) {
  return getDepartureDate(a).getTime() - getDepartureDate(b).getTime();
}
