import type { Booking, BookingStatus } from "@/types/api/booking";

// ── HostBookingCard ──

export interface HostBookingCardProps {
  booking: Booking;
}

// ── BookingListSkeleton ──

export interface BookingListSkeletonProps {
  count?: number;
}

// ── HostBookings ──

/** Filtro de estado: null = todas las reservas. */
export type BookingStatusFilter = BookingStatus | null;

export interface HostBookingsProps {
  /** Wallet del anfitrión autenticado. */
  host: string;
}

// ── BookingFilters ──

export interface BookingFiltersProps {
  /** Estado seleccionado (null = todas). */
  value: BookingStatusFilter;
  /** Total de reservas visibles según el filtro actual. */
  total: number;
  onChange: (status: BookingStatusFilter) => void;
}

// ── BookingSection ──

export interface BookingSectionProps {
  /** Estado que representa la sección (para el marcador de color). */
  status: BookingStatus;
  /** Título de la sección (ej: "Pendientes por aceptar"). */
  title: string;
  bookings: Booking[];
  loading?: boolean;
  /** Mensaje cuando la sección no tiene reservas. */
  emptyMessage?: string;
  emptyDescription?: string;
}

/** Grupo de reservas de una sección prioritaria. */
export interface BookingSectionGroup {
  status: BookingStatus;
  title: string;
  bookings: Booking[];
}
