import type { ApiBookedDateRange } from "@/types/booking";

const DAY_MS = 86_400_000;

/** Formats a Date as YYYY-MM-DD (local), matching the backend query format. */
export function dateToParam(date: Date): string {
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("-");
}

/** Parses YYYY-MM-DD into a local Date at 00:00. */
export function parseDateParam(value: string): Date | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return null;
  const [, year, month, day] = match;
  const date = new Date(Number(year), Number(month) - 1, Number(day));
  return Number.isNaN(date.getTime()) ? null : date;
}

const startOfDay = (date: Date) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();

/**
 * Converts backend booked ranges into start-of-day timestamps (ms) covering
 * every occupied night in `[checkIn, checkOut)`, ready for the calendar's
 * `disabledDates`.
 */
export function bookingRangesToNightTimestamps(
  ranges: ApiBookedDateRange[],
): number[] {
  const nights = new Set<number>();
  for (const range of ranges) {
    const start = parseDateParam(range.checkIn);
    const end = parseDateParam(range.checkOut);
    if (!start || !end) continue;
    if (end <= start) continue;
    for (let day = start.getTime(); day <= end.getTime(); day += DAY_MS) {
      nights.add(startOfDay(new Date(day)));
    }
  }
  return [...nights];
}
