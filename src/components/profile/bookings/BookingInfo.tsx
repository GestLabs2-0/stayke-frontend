"use client";

import { CalendarRange, MapPin, User } from "lucide-react";

interface BookingInfoProps {
  location?: string;
  rangeLabel: string;
  guestName: string;
  price: string;
}

/** Filas de información de la reserva (ubicación, fechas, huésped, precio). */
export function BookingInfo({
  location,
  rangeLabel,
  guestName,
  price,
}: BookingInfoProps) {
  return (
    <>
      {location && (
        <p className="flex items-center gap-2 font-sans text-sm text-secondary">
          <MapPin className="size-4 shrink-0 text-accent-warm" />
          <span>{location}</span>
        </p>
      )}

      <p className="flex items-center gap-2 font-sans text-sm text-secondary">
        <CalendarRange className="size-4 shrink-0 text-accent-warm" />
        <span>{rangeLabel}</span>
      </p>

      <p className="flex items-center gap-2 font-sans text-sm text-secondary">
        <User className="size-4 shrink-0 text-accent-warm" />
        <span>
          Huésped:{" "}
          <span className="font-semibold text-foreground">{guestName}</span>
        </span>
      </p>

      <p className="font-sans">
        <span className="font-montserrat text-xl font-bold text-foreground">
          {price}
        </span>
      </p>
    </>
  );
}
