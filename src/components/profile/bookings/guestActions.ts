import { Flag, Star, X } from "lucide-react";

import { BookingStatus } from "@GestLabs2-0/stayke-escrow";
import type { Booking } from "@/types/api/booking";
import type { GuestBookingAction } from "@/types/profile/bookings";

/**
 * Acciones disponibles para el huésped según el estado de la reserva.
 * `guestHasReviewed` se deriva del on-chain (booking.hostReview > 0); null =
 * aún desconocido (no se genera el botón de reseña hasta conocerlo).
 */
export function actionsForGuest(
  booking: Booking,
  guestHasReviewed: boolean | null,
): GuestBookingAction[] {
  switch (booking.status) {
    case BookingStatus.Pending:
    case BookingStatus.HostAccepted:
      return [
        { id: "cancel", label: "Cancelar reserva", icon: X, variant: "danger" },
      ];
    case BookingStatus.Active:
      return [
        {
          id: "dispute",
          label: "Iniciar disputa",
          icon: Flag,
          variant: "danger",
        },
      ];
    case BookingStatus.Completed:
      return [
        {
          id: "dispute",
          label: "Disputar",
          icon: Flag,
          variant: "danger",
        },
        ...(guestHasReviewed === false
          ? []
          : [
              {
                id: "review" as const,
                label: "Reseñar",
                icon: Star,
                variant: "primary" as const,
              },
            ]),
      ];
    case BookingStatus.Released:
      return guestHasReviewed === false
        ? []
        : [
            {
              id: "review" as const,
              label: "Reseñar",
              icon: Star,
              variant: "primary" as const,
            },
          ];
    default:
      return [];
  }
}
