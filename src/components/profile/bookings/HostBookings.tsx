"use client";

import { CalendarDays } from "lucide-react";
import { useState } from "react";

import { BookingStatus } from "@GestLabs2-0/stayke-escrow";
import { useHostBookings } from "@/hooks/useHostBookings";
import { useWalletContext } from "@/hooks/useWallet";
import type { Booking } from "@/types/api/booking";
import {
  BOOKING_STATUS_LABELS,
  PRIORITY_BOOKING_STATUSES,
} from "@/types/api/booking";
import type {
  BookingSectionGroup,
  BookingStatusFilter,
} from "@/types/profile/bookings";
import { Breadcrumb } from "../Breadcrumb";
import { EmptyState } from "../EmptyState";
import { BookingFilters } from "./BookingFilters";
import { BookingListSkeleton } from "./BookingListSkeleton";
import { BookingSection } from "./BookingSection";

/** Títulos de las secciones prioritarias de la vista inicial. */
const PRIORITY_SECTION_TITLES: Partial<Record<BookingStatus, string>> = {
  [BookingStatus.Pending]: "Pendientes por aceptar",
  [BookingStatus.HostAccepted]: "Por comenzar",
  [BookingStatus.Active]: "Activos",
};

function sectionTitle(status: BookingStatus): string {
  return PRIORITY_SECTION_TITLES[status] ?? BOOKING_STATUS_LABELS[status];
}

/**
 * En la vista sin filtro devuelve solo las secciones prioritarias
 * (Pendientes → Por comenzar → Activos); el resto de estados queda oculto y
 * solo se ve al seleccionar un filtro concreto.
 */
function buildGroups(
  bookings: Booking[],
  status: BookingStatusFilter,
): BookingSectionGroup[] {
  if (status === null) {
    return PRIORITY_BOOKING_STATUSES.map((bookingStatus) => ({
      status: bookingStatus,
      title: sectionTitle(bookingStatus),
      bookings: bookings.filter((booking) => booking.status === bookingStatus),
    }));
  }
  return [{ status, title: sectionTitle(status), bookings }];
}

export function HostBookings() {
  const { userWallet } = useWalletContext();
  const [status, setStatus] = useState<BookingStatusFilter>(null);
  const { bookings, loading } = useHostBookings(userWallet, status);

  const groups = buildGroups(bookings, status);
  const hasBookings = groups.some((group) => group.bookings.length > 0);

  return (
    <div className="space-y-6">
      <Breadcrumb />

      <div className="flex flex-wrap items-center gap-3">
        <span className="flex size-10 items-center justify-center rounded-xl bg-primary/10">
          <CalendarDays className="size-5 text-primary" />
        </span>
        <div>
          <h1 className="font-montserrat text-[22px] font-bold text-[#171717]">
            Reservas
          </h1>
          <p className="font-sans text-sm text-[#434654]">
            Gestioná las reservas de tus alojamientos.
          </p>
        </div>
      </div>

      <BookingFilters
        value={status}
        total={bookings.length}
        onChange={setStatus}
      />

      {loading ? (
        <BookingListSkeleton />
      ) : !hasBookings ? (
        <EmptyState
          message="No tenés reservas."
          description="Cuando un huésped reserve un alojamiento, aparecerá acá."
        />
      ) : (
        <div className="space-y-8">
          {groups.map((group) => (
            <BookingSection
              key={group.status}
              status={group.status}
              title={group.title}
              bookings={group.bookings}
            />
          ))}
        </div>
      )}
    </div>
  );
}
