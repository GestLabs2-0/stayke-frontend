import {
  CalendarCheck,
  Check,
  Flag,
  Play,
  RefreshCw,
  Star,
  X,
} from "lucide-react";

import { BookingStatus } from "@GestLabs2-0/stayke-escrow";
import type { Booking } from "@/types/api/booking";
import type { BookingAction } from "@/types/profile/bookings";

const NOT_READY_HINT = "Se habilita tras la ventana de 24 horas";

/** "Completar" se habilita cuando ya llegó el día de check-out. */
function isCheckOutReached(booking: Pick<Booking, "checkOut">): boolean {
  return booking.checkOut * 1000 <= Date.now();
}

const REVIEW_ACTION: BookingAction = {
  id: "review",
  label: "Reseñar",
  icon: Star,
  variant: "primary",
};

/**
 * Acciones disponibles según el estado de la reserva.
 * `releaseReady` y `hostHasReviewed` provienen de lecturas off/on-chain.
 */
export function actionsFor(
  booking: Booking,
  releaseReady: boolean,
  hostHasReviewed: boolean | null,
): BookingAction[] {
  switch (booking.status) {
    case BookingStatus.Pending:
      return [
        {
          id: "accept",
          label: "Aceptar reserva",
          icon: Check,
          variant: "primary",
        },
        { id: "reject", label: "Rechazar reserva", icon: X, variant: "danger" },
      ];
    case BookingStatus.HostAccepted:
      return [
        {
          id: "starts",
          label: "Comenzar",
          icon: Play,
          variant: "primary",
          disabled: !releaseReady,
          hint: NOT_READY_HINT,
        },
        { id: "cancel", label: "Cancelar reserva", icon: X, variant: "danger" },
      ];
    case BookingStatus.Active:
      return [
        {
          id: "completes",
          label: "Completar reserva",
          icon: CalendarCheck,
          variant: "primary",
          disabled: !isCheckOutReached(booking),
          hint: isCheckOutReached(booking)
            ? undefined
            : "Se habilita el día de check-out",
        },
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
          id: "release",
          label: "Liberar fondos",
          icon: RefreshCw,
          variant: "primary",
          disabled: !releaseReady,
          hint: NOT_READY_HINT,
        },
        { id: "dispute", label: "Disputar", icon: Flag, variant: "danger" },
        ...(hostHasReviewed === false ? [REVIEW_ACTION] : []),
      ];
    case BookingStatus.Released:
      return hostHasReviewed === false ? [REVIEW_ACTION] : [];
    default:
      return [];
  }
}
