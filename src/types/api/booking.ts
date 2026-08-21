import { BookingStatus } from "@GestLabs2-0/stayke-escrow";
import type { ApiPaginatedResponse } from "../http";

export type { BookingStatus };

/** Booking devuelto por GET /api/v1.0/bookings. */
export interface Booking {
  /** PDA on-chain de la reserva (44 caracteres base58). */
  idPda: string;
  /** Datos embebidos de la propiedad (sin consulta adicional). */
  propertyValues: {
    title: string;
    price: number;
    /** PDA on-chain de la propiedad. */
    pda: string;
    /** Clave de la imagen en el bucket; se concatena a la URL base. */
    imageKey: string;
    address: string;
    city: string;
    countryCode: string;
  };
  /** Datos embebidos del huésped. */
  guestValues: {
    name: string;
    lastName: string;
    /** PDA on-chain del perfil. */
    userProfile: string;
    /** PDA on-chain de la reputación. */
    reputation: string;
    deposited: number;
  };
  /** Datos embebidos del anfitrión. */
  hostValues: {
    name: string;
    lastName: string;
    userProfile: string;
    reputation: string;
    deposited: number;
  };
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
  /** El huésped ya reseñó al anfitrión si booking.hostReview > 0 (on-chain). */
  resellable: boolean;
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
export interface BookingListResult extends ApiPaginatedResponse<Booking> {}

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
