import { BookingStatus } from "@GestLabs2-0/stayke-escrow";
import type { HostBookingAction } from "@/types/profile/bookings";

export const HOST_CONFIRM_MESSAGES: Partial<
  Record<HostBookingAction, { title: string; description: string }>
> = {
  accept: {
    title: "¿Aceptas la reserva?",
    description: "Si aceptas y luego cancelas puedes ser penalizado",
  },
  reject: {
    title: "¿Rechazar la reserva?",
    description: "Esta acción no se puede deshacer.",
  },
  cancel: {
    title: "¿Cancelar la reserva?",
    description: "Esta acción no se puede deshacer",
  },
  release: {
    title: "¿Liberar los fondos al anfitrión?",
    description: "Solo acepta si la plataforma no ha liberado los fondos",
  },
  expire: {
    title: "¿Expirar la reserva?",
    description:
      "Han transcurrido más de 24 horas sin respuesta. Se reembolsarán los fondos al huésped.",
  },
};

export const REVIEWABLE_STATUSES = [
  BookingStatus.Completed,
  BookingStatus.Released,
];
