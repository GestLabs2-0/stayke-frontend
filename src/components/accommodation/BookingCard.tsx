"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { sileo } from "sileo";

import { DateRangeCalendar } from "@/components/accommodation/DateRangeCalendar";
import { accommodationBookPath } from "@/constants/routes";

interface BookingCardProps {
  id: string;
  price: number;
  maxGuest?: number;
}

export function BookingCard({ id, price, maxGuest }: BookingCardProps) {
  const router = useRouter();
  const [checkIn, setCheckIn] = useState<Date | null>(null);
  const [checkOut, setCheckOut] = useState<Date | null>(null);

  const handleReserve = () => {
    if (!checkIn || !checkOut) {
      sileo.info({ title: "Selecciona las fechas de tu estadía" });
      return;
    }
    router.push(accommodationBookPath(id, { checkIn, checkOut }));
  };

  const dateLabel = (date: Date) =>
    date.toLocaleDateString("es", { day: "numeric", month: "short" });

  const rangeLabel =
    checkIn && checkOut
      ? `${dateLabel(checkIn)} – ${dateLabel(checkOut)}`
      : checkIn
        ? `${dateLabel(checkIn)} – ...`
        : "Selecciona tus fechas";

  return (
    <div className="card-white">
      <div className="flex items-baseline justify-between gap-2">
        <div className="flex items-baseline gap-1.5">
          <p className="font-montserrat text-3xl font-bold tracking-tight text-zinc-900">
            {price.toLocaleString("es-CO")} $
          </p>
          <span className="text-sm text-zinc-500">por noche</span>
        </div>
        {maxGuest != null && (
          <span className="shrink-0 rounded-full bg-surface px-2.5 py-1 text-xs font-medium text-zinc-600">
            Hasta {maxGuest} huéspedes
          </span>
        )}
      </div>

      <DateRangeCalendar
        onChange={(inDate, outDate) => {
          setCheckIn(inDate);
          setCheckOut(outDate);
        }}
      />

      <div className="mt-4 flex items-center justify-between gap-2 rounded-xl bg-surface/60 px-3 py-2">
        <span className="text-sm font-medium text-zinc-600">Tu estadía</span>
        <span
          className={`text-sm font-semibold ${
            checkIn ? "text-primary" : "text-zinc-400"
          }`}
        >
          {rangeLabel}
        </span>
      </div>

      <button
        type="button"
        onClick={handleReserve}
        className="mt-4 cursor-pointer w-full rounded-xl bg-primary py-3.5 font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-primary-hover hover:shadow-lg active:translate-y-0"
      >
        Reservar
      </button>
    </div>
  );
}
