"use client";

import { CalendarRange, User } from "lucide-react";

import { BookingStatus } from "@GestLabs2-0/stayke-escrow";
import { formatPrice } from "@/helpers/formatPrice";
import { BOOKING_STATUS_LABELS } from "@/types/api/booking";
import type { HostBookingCardProps } from "@/types/profile/bookings";

/** Acorta una wallet base58 para mostrarla de forma legible. */
function shortWallet(address: string) {
  if (address.length <= 12) return address;
  return `${address.slice(0, 4)}…${address.slice(-4)}`;
}

function formatDate(unixSeconds: number) {
  return new Date(unixSeconds * 1000).toLocaleDateString("es", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function HostBookingCard({ booking }: HostBookingCardProps) {
  const rangeLabel = `${formatDate(booking.checkIn)} – ${formatDate(
    booking.checkOut,
  )}`;

  return (
    <article className="card-white flex flex-col gap-4 p-4 sm:flex-row sm:items-center">
      <div className="min-w-0 flex-1 space-y-2">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <h3 className="font-montserrat text-[16px] font-bold text-[#171717]">
            Reserva {shortWallet(booking.idPda)}
          </h3>
        </div>

        <p className="flex items-center gap-1.5 font-sans text-sm text-[#434654]">
          <CalendarRange className="size-4 shrink-0 text-accent-warm" />
          <span>{rangeLabel}</span>
        </p>

        <p className="flex items-center gap-1.5 font-sans text-sm text-[#434654]">
          <User className="size-4 shrink-0 text-accent-warm" />
          <span>Huésped: {shortWallet(booking.guest)}</span>
        </p>

        <p className="font-sans">
          <span className="font-montserrat text-xl font-bold text-[#171717]">
            {formatPrice(booking.totalPrice)}
          </span>
        </p>
      </div>

      <span
        className={`inline-block w-fit rounded-full px-2.5 py-1 font-sans text-xs font-semibold tracking-wide uppercase ${
          booking.status === BookingStatus.Completed ||
          booking.status === BookingStatus.Released
            ? "bg-green-100 text-green-700"
            : "bg-[#ebe7e7] text-[#a0a5b5]"
        }`}
      >
        {BOOKING_STATUS_LABELS[booking.status]}
      </span>
    </article>
  );
}
