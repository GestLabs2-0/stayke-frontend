import type { LucideIcon } from "lucide-react";

import type { HostBookingAction } from "@/lib/contracts/buildHostBookingAction";
import type { Booking, BookingStatus } from "@/types/api/booking";

// ── HostBookingCard ──

export interface HostBookingCardProps {
  booking: Booking;
  /** Se llama tras una acción on-chain exitosa para refrescar la lista. */
  onChanged?: () => void;
}

export type BookingActionVariant = "primary" | "danger";

/** Acción de la tarjeta; `dispute` queda como placeholder pendiente de SDK. */
export interface BookingAction {
  id: HostBookingAction | "dispute";
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
}

// ── BookingSection ──

export interface BookingSectionProps {
  /** Estado que representa la sección (para el fetch y el marcador de color). */
  status: BookingStatus;
  /** Título de la sección (ej: "Pendientes por aceptar"). */
  title: string;
  /** Wallet del anfitrión autenticado. */
  host: string | null | undefined;
  /** Tamaño de página del fetch paginado. */
  pageSize?: number;
  /** Mensaje cuando la sección no tiene reservas. */
  emptyMessage?: string;
  emptyDescription?: string;
  /** Reporta el total de reservas de la sección al padre. */
  onTotalChange?: (total: number) => void;
}
