/**
 * Booking-related types.
 *
 * TS-STK-287: transient types used while wiring the on-chain createBooking
 * flow. Replace the ephemeral `BookedDateRange` with the real backend
 * response once the "covered dates" endpoint exists.
 */

/** Ephemeral range of dates that are already booked (mock source). */
export interface BookedDateRange {
  /** Unix timestamp (seconds) of the first occupied night (check-in). */
  start: number;
  /** Unix timestamp (seconds) of the last occupied night (check-out). */
  end: number;
}

/** Range of booked dates returned by the backend (GET /bookings/booked-dates). */
export interface ApiBookedDateRange {
  /** Check-in day, YYYY-MM-DD (first occupied night). */
  checkIn: string;
  /** Check-out day, YYYY-MM-DD (exclusive). */
  checkOut: string;
}

/** Query params for GET /bookings/booked-dates. */
export interface GetBookedDatesParams {
  /** On-chain property/listing address (required). */
  property: string;
  /** Inclusive start, YYYY-MM-DD (optional). */
  from?: string;
  /** Inclusive end, YYYY-MM-DD (optional). */
  to?: string;
}

/**
 * Output of `buildCreateBookingInstruction`: the derived PDAs plus the
 * versioned transaction ready to be signed and sent by the wallet.
 */
export interface CreateBookingTx {
  /** Booking PDA (seeded by property + clientProfile + checkIn). */
  booking: string;
  /** BookingDays PDA (seeded by property + checkIn). */
  bookingDays: string;
  /** Escrow token account PDA (seeded by booking). */
  escrowTokenAccount: string;
  /** Versioned transaction that carries the createBooking instruction. */
  tx: import("@solana/web3.js").VersionedTransaction;
}
