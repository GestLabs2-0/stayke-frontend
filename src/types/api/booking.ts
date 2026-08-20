import { BookingStatus } from "@GestLabs2-0/stayke-escrow";
import type { PaginationMeta } from "./property";

export type { BookingStatus };

/** Booking devuelto por GET /api/v1.0/bookings. */
export interface Booking {
  /** PDA on-chain de la reserva (44 caracteres base58). */
  idPda: string;
  /** PDA on-chain de la propiedad (44 caracteres base58). */
  property: string;
  /** Wallet del huésped (44 caracteres base58). */
  guest: string;
  /** Wallet del anfitrión (44 caracteres base58). */
  host: string;
  /** PDA de la cuenta escrow de la reserva. */
  escrow: string;
  /** Precio total de la reserva. */
  totalPrice: number;
  /** Timestamp Unix (segundos) del check-in. */
  checkIn: number;
  /** Timestamp Unix (segundos) del check-out. */
  checkOut: number;
  /** Estado actual de la reserva. */
  status: BookingStatus;
  resellable: boolean;
  guestReviewed: boolean;
  hostReviewed: boolean;
}

/** Query params de GET /api/v1.0/bookings. */
export interface GetBookingsParams {
  /** Wallet del anfitrión (filtro). */
  host?: string;
  /** Wallet del huésped (filtro). */
  guest?: string;
  /** Estado; si se omite se devuelven todas las reservas. */
  status?: BookingStatus;
  /** Check-in mínimo (timestamp Unix en segundos). */
  checkIn?: number;
  /** Check-out máximo (timestamp Unix en segundos). */
  checkOut?: number;
  limit?: number;
  offset?: number;
}

/** Respuesta paginada de GET /api/v1.0/bookings. */
export interface BookingListResult {
  status: boolean;
  data: Booking[] | null;
  meta: PaginationMeta | null;
  message: string | string[];
  errors?: string[];
}

/** Etiquetas legibles (español) de cada estado de reserva. */
export const BOOKING_STATUS_LABELS: Record<BookingStatus, string> = {
  [BookingStatus.Pending]: "Pendiente por aceptar",
  [BookingStatus.HostAccepted]: "Por comenzar",
  [BookingStatus.Active]: "Activa",
  [BookingStatus.Completed]: "Completada",
  [BookingStatus.Released]: "Fondos liberados",
  [BookingStatus.Cancelled]: "Cancelada",
  [BookingStatus.Disputed]: "En disputa",
  [BookingStatus.DisputeResolved]: "Disputa resuelta",
  [BookingStatus.DisputeRejected]: "Disputa rechazada",
};

/** Estados que aparecen en las secciones prioritarias de la vista inicial. */
export const PRIORITY_BOOKING_STATUSES: BookingStatus[] = [
  BookingStatus.Pending,
  BookingStatus.HostAccepted,
  BookingStatus.Active,
];
