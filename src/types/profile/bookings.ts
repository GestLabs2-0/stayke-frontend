import type { LucideIcon } from "lucide-react";

import type { HostBookingAction } from "@/lib/contracts/buildHostBookingAction";
import type { Booking, BookingStatus } from "@/types/api/booking";

// ── Roles ──

/** Actor propietario de la vista de reservas: anfitrión o huésped. */
export type BookingRole = "host" | "guest";

// ── GuestBookingCard ──

export interface GuestBookingCardProps {
  booking: Booking;
  /** Se llama tras una acción exitosa (on-chain o reseña) para refrescar. */
  onChanged?: () => void;
}

/** Acción de la tarjeta de huésped; `dispute` queda como placeholder. */
export type GuestBookingActionId = "cancel" | "review" | "dispute";

export interface GuestBookingAction {
  id: GuestBookingActionId;
  label: string;
  icon: LucideIcon;
  variant: BookingActionVariant;
  disabled?: boolean;
  hint?: string;
}

// ── HostBookingCard ──

export interface HostBookingCardProps {
  booking: Booking;
  /** Se llama tras una acción on-chain exitosa para refrescar la lista. */
  onChanged?: () => void;
}

export type BookingActionVariant = "primary" | "danger";

/** Acción de la tarjeta; `dispute` queda como placeholder pendiente de SDK. */
export interface BookingAction {
  id: HostBookingAction | "dispute" | "review";
  label: string;
  icon: LucideIcon;
  variant: BookingActionVariant;
  disabled?: boolean;
  hint?: string;
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
  /** Fecha seleccionada ("YYYY-MM-DD"). Solo se muestra el selector si se pasa el handler. */
  dateValue?: string;
  onChangeDate?: (date: string) => void;
}

// ── BookingSection ──

export interface BookingSectionProps {
  /** Estado que representa la sección (para el fetch y el marcador de color).
   * null = todas las reservas del actor (vista unificada bajo filtros). */
  status: BookingStatus | null;
  /** Título de la sección (ej: "Pendientes por aceptar"). */
  title: string;
  /** Wallet del actor autenticado (anfitrión en la vista host, huésped en la guest). */
  wallet: string | null | undefined;
  /** Qué actor se consulta: "host" (default) o "guest". */
  role?: BookingRole;
  /** Tamaño de página del fetch paginado. */
  pageSize?: number;
  /** Filtro de fecha: solo reservas con check-in mayor o igual (segundos Unix). */
  checkIn?: number;
  /** Filtro de fecha: solo reservas con check-out menor o igual (segundos Unix). */
  checkOut?: number;
  /** Mensaje cuando la sección no tiene reservas. */
  emptyMessage?: string;
  emptyDescription?: string;
  /** Reporta el total de reservas de la sección al padre. */
  onTotalChange?: (total: number) => void;
}
