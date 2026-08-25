"use client";

import type { BookingStatus } from "@GestLabs2-0/stayke-escrow";
import { BOOKING_STATUS_LABELS } from "@/types/api/booking";

interface BookingHeaderProps {
  title: string;
  status: BookingStatus;
  statusDotClass: string;
  statusBadgeClass: string;
}

/** Punto de estado, título y badge del estado de la reserva. */
export function BookingHeader({
  title,
  status,
  statusDotClass,
  statusBadgeClass,
}: BookingHeaderProps) {
  return (
    <div className="flex flex-wrap items-center gap-2.5">
      <span
        aria-hidden="true"
        className={`size-2.5 rounded-full ${statusDotClass}`}
      />
      <h3 className="font-montserrat text-[16px] font-bold text-foreground">
        {title}
      </h3>
      <span
        className={`inline-block rounded-full px-2.5 py-1 font-sans text-xs font-semibold tracking-wide uppercase ${statusBadgeClass}`}
      >
        {BOOKING_STATUS_LABELS[status]}
      </span>
    </div>
  );
}
