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
  /** Estado de la reserva que representa la sección. */
  status: BookingStatus;
  bookings: Booking[];
  loading?: boolean;
}

/** Helper: grupo de reservas de una sección prioritaria. */
export interface BookingSectionGroup {
  status: BookingStatus;
  bookings: Booking[];
}
