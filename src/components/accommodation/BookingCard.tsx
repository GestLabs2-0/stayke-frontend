"use client";

import { useState } from "react";
import { sileo } from "sileo";

import { monthNames, weekDays } from "@/components/home/SearchBar/mocks";
import { ChevronLeftIcon, ChevronRightIcon } from "@/icons";

interface BookingCardProps {
  price: number;
  maxGuest?: number;
}

export function BookingCard({ price, maxGuest }: BookingCardProps) {
  const today = new Date();
  const startOfToday = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
  );

  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [checkIn, setCheckIn] = useState<Date | null>(null);
  const [checkOut, setCheckOut] = useState<Date | null>(null);

  const goPrev = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear(viewYear - 1);
    } else {
      setViewMonth(viewMonth - 1);
    }
  };

  const goNext = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear(viewYear + 1);
    } else {
      setViewMonth(viewMonth + 1);
    }
  };

  const selectDay = (day: Date) => {
    if (day < startOfToday) return;
    if (!checkIn || (checkIn && checkOut)) {
      setCheckIn(day);
      setCheckOut(null);
      return;
    }
    if (day > checkIn) {
      setCheckOut(day);
      return;
    }
    setCheckIn(day);
    setCheckOut(null);
  };

  const isSelected = (day: Date) =>
    (checkIn && day.getTime() === checkIn.getTime()) ||
    (checkOut && day.getTime() === checkOut.getTime());

  const isInRange = (day: Date) =>
    !!checkIn && !!checkOut && day > checkIn && day < checkOut;

  const isToday = (day: Date) => day.getTime() === startOfToday.getTime();

  const firstDay = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

  const dateLabel = (date: Date) =>
    date.toLocaleDateString("es", { day: "numeric", month: "short" });

  const handleReserve = () => {
    if (!checkIn) {
      sileo.info({ title: "Selecciona las fechas de tu estadía" });
      return;
    }
    sileo.info({ title: "El flujo de reserva llega pronto" });
  };

  const rangeLabel =
    checkIn && checkOut
      ? `${dateLabel(checkIn)} – ${dateLabel(checkOut)}`
      : checkIn
        ? `${dateLabel(checkIn)} – ...`
        : "Selecciona tus fechas";

  return (
    <div className="card-white">
      <div className="flex items-baseline gap-2">
        <p className="text-2xl font-bold text-zinc-900">
          {price.toLocaleString("es-CO")} $
        </p>
        <span className="text-sm text-zinc-500">/ noche</span>
      </div>

      {maxGuest != null && (
        <p className="mt-1 text-sm text-zinc-500">Hasta {maxGuest} huéspedes</p>
      )}

      <div className="mt-5">
        <div className="mb-3 flex items-center justify-between">
          <button
            type="button"
            onClick={goPrev}
            aria-label="Mes anterior"
            className="flex size-8 items-center justify-center rounded-full text-primary transition-colors hover:bg-purple-100"
          >
            <span className="flex [&>svg]:size-4">
              <ChevronLeftIcon />
            </span>
          </button>
          <p className="text-sm font-semibold text-zinc-700">
            {monthNames[viewMonth]} {viewYear}
          </p>
          <button
            type="button"
            onClick={goNext}
            aria-label="Mes siguiente"
            className="flex size-8 items-center justify-center rounded-full text-primary transition-colors hover:bg-purple-100"
          >
            <span className="flex [&>svg]:size-4">
              <ChevronRightIcon />
            </span>
          </button>
        </div>

        <div className="grid grid-cols-7 gap-1 text-center text-xs text-zinc-500">
          {weekDays.map((day) => (
            <div key={day} className="py-1 font-medium">
              {day}
            </div>
          ))}
        </div>

        <div className="mt-2 grid grid-cols-7 gap-1 text-center text-sm">
          {Array.from({ length: firstDay }).map((_, i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: empty placeholders, no state
            <div key={`empty-${i}`} />
          ))}
          {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((num) => {
            const day = new Date(viewYear, viewMonth, num);
            const isPast = day < startOfToday;
            const selected = isSelected(day);
            const inRange = isInRange(day);

            let cellClass = "py-2 rounded-full font-medium transition-colors";
            if (selected) {
              cellClass += " bg-primary text-white";
            } else if (inRange) {
              cellClass += " bg-primary/10 text-primary";
            } else if (isPast) {
              cellClass += " cursor-default text-zinc-300";
            } else {
              cellClass += isToday(day)
                ? " cursor-pointer text-primary font-semibold hover:bg-purple-100"
                : " cursor-pointer text-zinc-600 hover:bg-zinc-100";
            }

            return (
              <button
                key={num}
                type="button"
                disabled={isPast}
                onClick={() => selectDay(day)}
                className={cellClass}
              >
                {num}
              </button>
            );
          })}
        </div>
      </div>

      <p className="mt-4 text-sm text-zinc-500">{rangeLabel}</p>

      <button
        type="button"
        onClick={handleReserve}
        className="mt-4 w-full rounded-xl bg-primary py-3 font-semibold text-white transition-colors hover:bg-primary-hover"
      >
        Reservar
      </button>
    </div>
  );
}
