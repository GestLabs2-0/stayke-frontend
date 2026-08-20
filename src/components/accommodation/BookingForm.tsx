"use client";

import { useEffect, useState } from "react";
import { sileo } from "sileo";

import { DateRangeCalendar } from "@/components/accommodation/DateRangeCalendar";
import { formatPrice } from "@/helpers/formatPrice";
import { MinusIcon, PlusIcon } from "@/icons";

const DAY_MS = 86_400_000;

export interface BookingSelection {
  checkIn: Date | null;
  checkOut: Date | null;
  guests: number;
}

interface BookingFormProps {
  price: number;
  maxGuest: number;
  /** Start-of-day timestamps (ms) already booked and disabled. */
  bookedNights?: number[];
  /** Preloaded selection, e.g. from the listing detail page query params. */
  initialCheckIn?: Date | null;
  initialCheckOut?: Date | null;
  onSubmit?: (selection: BookingSelection) => void;
  submitLabel?: string;
  /** Disables the submit button while a tx is in flight (idempotency). */
  submitting?: boolean;
}

export function BookingForm({
  price,
  maxGuest,
  bookedNights = [],
  initialCheckIn = null,
  initialCheckOut = null,
  onSubmit,
  submitLabel = "Confirmar reserva",
  submitting = false,
}: BookingFormProps) {
  const [checkIn, setCheckIn] = useState<Date | null>(initialCheckIn);
  const [checkOut, setCheckOut] = useState<Date | null>(initialCheckOut);
  const [guests, setGuests] = useState(1);

  const nights =
    checkIn && checkOut
      ? Math.max(
          0,
          Math.round((checkOut.getTime() - checkIn.getTime()) / DAY_MS),
        )
      : 0;
  const subtotal = nights * price;
  const serviceFee = nights > 0 ? Math.round(subtotal * 0.1) : 0;
  const total = subtotal + serviceFee;

  useEffect(() => {
    setCheckIn(initialCheckIn);
    setCheckOut(initialCheckOut);
  }, [initialCheckIn, initialCheckOut]);

  const handleSubmit = () => {
    if (submitting) return;
    if (!checkIn || !checkOut) {
      sileo.info({ title: "Selecciona las fechas de tu estadía" });
      return;
    }
    if (nights < 1) return;
    onSubmit?.({ checkIn, checkOut, guests });
  };

  const rangeLabel =
    checkIn && checkOut
      ? `${checkIn.toLocaleDateString("es", {
          day: "numeric",
          month: "short",
        })} – ${checkOut.toLocaleDateString("es", {
          day: "numeric",
          month: "short",
        })}`
      : checkIn
        ? `${checkIn.toLocaleDateString("es", {
            day: "numeric",
            month: "short",
          })} – ...`
        : "Selecciona tus fechas";

  return (
    <div className="card-white space-y-5">
      <DateRangeCalendar
        onChange={(inDate, outDate) => {
          setCheckIn(inDate);
          setCheckOut(outDate);
        }}
        disabledDates={bookedNights}
      />

      <div className="flex items-center justify-between gap-4 rounded-xl bg-surface/60 px-3 py-2">
        <span className="text-sm font-medium text-zinc-600">Estadía</span>
        <span
          className={`text-sm font-semibold ${
            checkIn ? "text-primary" : "text-zinc-400"
          }`}
        >
          {rangeLabel}
        </span>
      </div>

      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-zinc-800">Huéspedes</p>
          <p className="text-xs text-zinc-500">Hasta {maxGuest} huéspedes</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            aria-label="Quitar huésped"
            onClick={() => setGuests((g) => Math.max(1, g - 1))}
            disabled={guests <= 1}
            className="flex size-8 items-center justify-center rounded-full border border-zinc-400 text-zinc-600 transition-colors hover:border-zinc-800 hover:text-zinc-800 disabled:cursor-not-allowed disabled:border-zinc-200 disabled:text-zinc-300"
          >
            <MinusIcon />
          </button>
          <span className="w-8 text-center text-sm font-semibold text-zinc-800">
            {guests}
          </span>
          <button
            type="button"
            aria-label="Agregar huésped"
            onClick={() => setGuests((g) => Math.min(maxGuest, g + 1))}
            disabled={guests >= maxGuest}
            className="flex size-8 items-center justify-center rounded-full border border-zinc-400 text-zinc-600 transition-colors hover:border-zinc-800 hover:text-zinc-800 disabled:cursor-not-allowed disabled:border-zinc-200 disabled:text-zinc-300"
          >
            <PlusIcon />
          </button>
        </div>
      </div>

      {nights > 0 && (
        <div className="space-y-2 border-t border-border pt-4 text-sm">
          <div className="flex justify-between text-zinc-600">
            <span>
              {formatPrice(price)} × {nights} noche{nights > 1 ? "s" : ""}
            </span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          <div className="flex justify-between text-zinc-600">
            <span>Tarifa de servicio</span>
            <span>{formatPrice(serviceFee)}</span>
          </div>
          <div className="flex justify-between border-t border-border pt-2 font-semibold text-zinc-900">
            <span>Total</span>
            <span>{formatPrice(total)}</span>
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={handleSubmit}
        disabled={submitting}
        aria-busy={submitting}
        className="w-full rounded-xl bg-primary py-3.5 font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-primary-hover hover:shadow-lg active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 disabled:hover:shadow-none"
      >
        {submitLabel}
      </button>
    </div>
  );
}
