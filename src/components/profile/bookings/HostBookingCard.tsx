"use client";

import {
  CalendarCheck,
  CalendarRange,
  Check,
  Flag,
  Home,
  MapPin,
  Play,
  RefreshCw,
  User,
  X,
} from "lucide-react";
import Image from "next/image";
import { sileo } from "sileo";

import { BookingStatus } from "@GestLabs2-0/stayke-escrow";
import { formatPrice } from "@/helpers/formatPrice";
import { propertyImageUrl } from "@/helpers/propertyImageUrl";
import type { Booking } from "@/types/api/booking";
import { BOOKING_STATUS_LABELS } from "@/types/api/booking";
import type { HostBookingCardProps } from "@/types/profile/bookings";
import {
  STATUS_BADGE_CLASSES,
  STATUS_DOT_CLASSES,
} from "./bookingStatusStyles";

type ActionVariant = "primary" | "danger";

interface BookingAction {
  label: string;
  icon: typeof Check;
  variant: ActionVariant;
  disabled?: boolean;
  hint?: string;
}

const PRIMARY_BUTTON =
  "bg-primary text-white hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40";
const DANGER_BUTTON =
  "border border-red-200 bg-white text-red-600 hover:bg-red-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-300";

function shortAddress(address: string) {
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

function fullName(name: string, lastName: string, fallback: string) {
  const full = `${name} ${lastName}`.trim();
  return full.length > 0 ? full : shortAddress(fallback);
}

/** "Completar" se habilita cuando ya llegó el día de check-out. */
function isCheckOutReached(booking: Pick<Booking, "checkOut">): boolean {
  return booking.checkOut * 1000 <= Date.now();
}

function actionsFor(booking: Booking): BookingAction[] {
  switch (booking.status) {
    case BookingStatus.Pending:
      return [
        { label: "Aceptar reserva", icon: Check, variant: "primary" },
        { label: "Rechazar reserva", icon: X, variant: "danger" },
      ];
    case BookingStatus.HostAccepted:
      return [
        { label: "Comenzar", icon: Play, variant: "primary" },
        { label: "Cancelar reserva", icon: X, variant: "danger" },
      ];
    case BookingStatus.Active:
      return [
        {
          label: "Completar reserva",
          icon: CalendarCheck,
          variant: "primary",
          disabled: !isCheckOutReached(booking),
          hint: isCheckOutReached(booking)
            ? undefined
            : "Se habilita el día de check-out",
        },
        { label: "Iniciar disputa", icon: Flag, variant: "danger" },
      ];
    case BookingStatus.Completed:
      return [
        { label: "Liberar fondos", icon: RefreshCw, variant: "primary" },
        { label: "Disputar", icon: Flag, variant: "danger" },
      ];
    default:
      return [];
  }
}

export function HostBookingCard({ booking }: HostBookingCardProps) {
  const actions = actionsFor(booking);
  const imageSrc = propertyImageUrl(booking.propertyValues.imageKey);
  const location = [
    booking.propertyValues.city,
    booking.propertyValues.countryCode,
  ]
    .filter(Boolean)
    .join(", ");
  const rangeLabel = `${formatDate(booking.checkIn)} – ${formatDate(
    booking.checkOut,
  )}`;
  const guestName = fullName(
    booking.guestValues.name,
    booking.guestValues.lastName,
    booking.guestValues.userProfile,
  );

  const handleAction = (action: BookingAction) => {
    if (action.disabled) return;
    sileo.info({
      title: "Disponible próximamente",
      description: "Esta acción se habilitará en una próxima versión.",
    });
  };

  return (
    <article className="card-white flex flex-col gap-4 p-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md sm:flex-row sm:items-center">
      <div className="relative size-24 shrink-0 overflow-hidden rounded-xl bg-surface md:size-28">
        {imageSrc ? (
          <Image
            src={imageSrc}
            alt={booking.propertyValues.title}
            fill
            sizes="112px"
            className="object-cover"
          />
        ) : (
          <div className="flex size-full items-center justify-center text-muted">
            <Home className="size-8" />
          </div>
        )}
      </div>

      <div className="min-w-0 flex-1 space-y-2">
        <div className="flex flex-wrap items-center gap-2.5">
          <span
            aria-hidden="true"
            className={`size-2.5 rounded-full ${STATUS_DOT_CLASSES[booking.status]}`}
          />
          <h3 className="font-montserrat text-[16px] font-bold text-foreground">
            {booking.propertyValues.title}
          </h3>
          <span
            className={`inline-block rounded-full px-2.5 py-1 font-sans text-xs font-semibold tracking-wide uppercase ${STATUS_BADGE_CLASSES[booking.status]}`}
          >
            {BOOKING_STATUS_LABELS[booking.status]}
          </span>
        </div>

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
            {formatPrice(booking.totalPrice)}
          </span>
        </p>
      </div>

      {actions.length > 0 && (
        <div className="flex w-full shrink-0 flex-col gap-2 sm:w-44">
          {actions.map((action) => {
            const Icon = action.icon;
            return (
              <button
                key={action.label}
                type="button"
                onClick={() => handleAction(action)}
                disabled={action.disabled}
                title={action.disabled ? action.hint : undefined}
                className={`inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-full px-4 py-2.5 font-plus-jakarta text-[13px] font-semibold transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-50 ${action.variant === "primary" ? PRIMARY_BUTTON : DANGER_BUTTON}`}
              >
                <Icon className="size-4" />
                {action.label}
              </button>
            );
          })}
        </div>
      )}
    </article>
  );
}
