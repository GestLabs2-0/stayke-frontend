"use client";

import { useEffect, useState } from "react";
import { sileo } from "sileo";

import { BookingStatus } from "@GestLabs2-0/stayke-escrow";
import { formatPrice } from "@/helpers/formatPrice";
import { propertyImageUrl } from "@/helpers/propertyImageUrl";
import { useHostBookingAction } from "@/hooks/contracts/useHostBookingAction";
import type { HostBookingAction } from "@/lib/contracts/buildHostBookingAction";
import type {
  BookingAction,
  HostBookingCardProps,
} from "@/types/profile/bookings";
import { BookingHeader } from "./BookingHeader";
import { BookingInfo } from "./BookingInfo";
import { BookingThumbnail } from "./BookingThumbnail";
import { actionsFor } from "./bookingActions";
import {
  STATUS_BADGE_CLASSES,
  STATUS_DOT_CLASSES,
} from "./bookingStatusStyles";
import { HostBookingActions } from "./HostBookingActions";

const CONFIRM_MESSAGES: Partial<
  Record<HostBookingAction, { title: string; description: string }>
> = {
  reject: {
    title: "¿Rechazar la reserva?",
    description: "Esta acción no se puede deshacer.",
  },
  cancel: {
    title: "¿Cancelar la reserva?",
    description: "Esta acción no se puede deshacer",
  },
  release: {
    title: "¿Liberar los fondos al anfitrión?",
    description: "Solo acepta si la plataforma no ha liberado los fondos",
  },
};

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

export function HostBookingCard({ booking, onChanged }: HostBookingCardProps) {
  const { run, getEligibility } = useHostBookingAction();
  const [releaseReady, setReleaseReady] = useState(false);
  const [busy, setBusy] = useState<HostBookingAction | null>(null);

  useEffect(() => {
    let mounted = true;
    setReleaseReady(false);
    if (
      booking.status === BookingStatus.HostAccepted ||
      booking.status === BookingStatus.Completed
    ) {
      getEligibility(booking).then((ready) => {
        if (mounted) setReleaseReady(ready);
      });
    }
    return () => {
      mounted = false;
    };
  }, [booking, getEligibility]);

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

  const handleAction = async (action: BookingAction) => {
    if (action.disabled) return;

    if (action.id === "dispute") {
      sileo.info({
        title: "Disponible próximamente",
        description:
          "La apertura de disputas se habilita en una próxima versión.",
      });
      return;
    }

    const confirm = CONFIRM_MESSAGES[action.id];

    if (!confirm) return;

    const { title, description } = confirm;
    sileo.action({
      title,
      description,
      position: "top-center",
      button: {
        title,
        onClick: async () => {
          if (action.id === "dispute") return;

          setBusy(action.id);
          try {
            const result = await run(booking, action.id);
            if (result.status) onChanged?.();
          } finally {
            setBusy(null);
          }
        },
      },
    });
  };

  const actions = actionsFor(booking, releaseReady);

  return (
    <article className="card-white flex flex-col gap-4 p-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md sm:flex-row sm:items-center">
      <BookingThumbnail
        imageSrc={imageSrc}
        title={booking.propertyValues.title}
      />

      <div className="min-w-0 flex-1 space-y-2">
        <BookingHeader
          title={booking.propertyValues.title}
          status={booking.status}
          statusDotClass={STATUS_DOT_CLASSES[booking.status]}
          statusBadgeClass={STATUS_BADGE_CLASSES[booking.status]}
        />

        <BookingInfo
          location={location}
          rangeLabel={rangeLabel}
          personName={guestName}
          personLabel="Huésped"
          price={formatPrice(booking.totalPrice)}
        />
      </div>

      <HostBookingActions
        actions={actions}
        busy={busy}
        onAction={handleAction}
      />
    </article>
  );
}
