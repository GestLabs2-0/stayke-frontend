import { address } from "@solana/kit";

import { BookingStatus, fetchMaybeBooking } from "@GestLabs2-0/stayke-escrow";
import type { SolanaClient } from "@/context/NetworkContext";
import type { Booking } from "@/types/api/booking";

export const EXPIRE_WINDOW_SECONDS = 24 * 60 * 60;

/**
 * Determina si la reserva pendiente superó la ventana de 24 horas usando
 * createdAt/created_at del backend o un timestamp on-chain pasado como argumento.
 */
export function isBookingExpiredSync(
  booking: Booking,
  onChainUpdatedAt?: number | null,
): boolean {
  if (booking.status !== BookingStatus.Pending) return false;

  if (typeof onChainUpdatedAt === "number" && onChainUpdatedAt > 0) {
    return Date.now() / 1000 >= onChainUpdatedAt + EXPIRE_WINDOW_SECONDS;
  }

  const rawCreated = booking.createdAt ?? booking.created_at;

  if (rawCreated) {
    const createdSec =
      typeof rawCreated === "number"
        ? rawCreated > 1e11
          ? rawCreated / 1000
          : rawCreated
        : new Date(rawCreated).getTime() / 1000;
    if (!Number.isNaN(createdSec) && createdSec > 0) {
      return Date.now() / 1000 >= createdSec + EXPIRE_WINDOW_SECONDS;
    }
  }

  return false;
}

/**
 * Consulta la cuenta on-chain y/o createdAt del backend para determinar si una
 * reserva pendiente puede ser expirada.
 */
export async function checkBookingExpired(
  client: SolanaClient,
  booking: Booking,
): Promise<boolean> {
  if (booking.status !== BookingStatus.Pending) return false;

  const rawCreated = booking.createdAt ?? booking.created_at;

  if (rawCreated) {
    const createdSec =
      typeof rawCreated === "number"
        ? rawCreated > 1e11
          ? rawCreated / 1000
          : rawCreated
        : new Date(rawCreated).getTime() / 1000;
    if (!Number.isNaN(createdSec) && createdSec > 0) {
      if (Date.now() / 1000 >= createdSec + EXPIRE_WINDOW_SECONDS) {
        return true;
      }
    }
  }

  try {
    const account = await fetchMaybeBooking(client.rpc, address(booking.idPda));
    if (!account.exists) return false;
    const updatedAt = Number(account.data.updatedAt);
    return Date.now() / 1000 >= updatedAt + EXPIRE_WINDOW_SECONDS;
  } catch (error) {
    console.error("Error fetching booking on-chain:", error);
    return false;
  }
}
