"use client";

import { CalendarRange, MapPin, User } from "lucide-react";

interface BookingInfoProps {
  location?: string;
  rangeLabel: string;
  /** Nombre de la persona mostrada (anfitrión o huésped según la vista). */
  personName: string;
  /** Etiqueta en español: "Huésped" en la vista anfitrión, "Anfitrión" en la del huésped. */
  personLabel?: string;
  price: string;
}

/** Filas de información de la reserva (ubicación, fechas, persona, precio). */
export function BookingInfo({
  location,
  rangeLabel,
  personName,
  personLabel = "Huésped",
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
          {personLabel}:{" "}
          <span className="font-semibold text-foreground">{personName}</span>
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
