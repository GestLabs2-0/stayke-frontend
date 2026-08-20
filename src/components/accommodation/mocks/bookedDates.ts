/**
 * Mock of already-booked nights.
 *
 * TS-STK-287: there is no backend endpoint that returns the dates already
 * covered for a listing, so this mock provides the blocked nights used to
 * disable days in the booking calendar. Replace with a real fetch once the
 * endpoint exists (keep the same return shape).
 */

const startOfDay = (date: Date) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();

const daysFromToday = (days: number) => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return startOfDay(date);
};

/** Nights (start-of-day ms) that are mocked as already booked for a listing. */
export function getMockBookedNights(propertyId: string): number[] {
  // Deterministic-ish mock: a fixed weekly schedule per listing id so the
  // calendar is stable across re-renders and visits.
  const shift = Number(propertyId.length % 3);
  return [
    daysFromToday(4 + shift),
    daysFromToday(5 + shift),
    daysFromToday(6 + shift),
    daysFromToday(11 + shift),
    daysFromToday(12 + shift),
    daysFromToday(20 + shift),
    daysFromToday(21 + shift),
    daysFromToday(27 + shift),
  ];
}
