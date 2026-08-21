import { Flag, Star, X } from "lucide-react";

import { BookingStatus } from "@GestLabs2-0/stayke-escrow";
import type { Booking } from "@/types/api/booking";
import type { GuestBookingAction } from "@/types/profile/bookings";

/** Acciones disponibles para el huésped según el estado de la reserva. */
export function actionsForGuest(booking: Booking): GuestBookingAction[] {
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
        ...(booking.guestReviewed
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
      return booking.guestReviewed
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
