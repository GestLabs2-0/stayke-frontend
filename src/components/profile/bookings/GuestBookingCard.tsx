"use client";

import { address } from "@solana/kit";
import { useEffect, useState } from "react";
import { sileo } from "sileo";

import { BookingStatus, fetchMaybeBooking } from "@GestLabs2-0/stayke-escrow";
import { formatPrice } from "@/helpers/formatPrice";
import { propertyImageUrl } from "@/helpers/propertyImageUrl";
import { useGuestBookingAction } from "@/hooks/contracts/useGuestBookingAction";
import useNetwork from "@/hooks/useNetwork";
import type {
  GuestBookingAction,
  GuestBookingActionId,
  GuestBookingCardProps,
} from "@/types/profile/bookings";
import { BookingHeader } from "./BookingHeader";
import { BookingInfo } from "./BookingInfo";
import { BookingThumbnail } from "./BookingThumbnail";
import {
  STATUS_BADGE_CLASSES,
  STATUS_DOT_CLASSES,
} from "./bookingStatusStyles";
import { GuestBookingActions } from "./GuestBookingActions";
import { GuestReviewForm } from "./GuestReviewForm";
import { actionsForGuest } from "./guestActions";

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

/** Estados en los que el huésped puede reseñar al anfitrión. */
const REVIEWABLE_STATUSES = [BookingStatus.Completed, BookingStatus.Released];

export function GuestBookingCard({
  booking,
  onChanged,
}: GuestBookingCardProps) {
  const { run } = useGuestBookingAction();
  const { client } = useNetwork();
  const [busy, setBusy] = useState<GuestBookingActionId | null>(null);
  const [reviewOpen, setReviewOpen] = useState(false);
  // Fuente de verdad on-chain: booking.hostReview > 0 significa que ya reseñó.
  // null = aún no consultado (no se muestra la reseña hasta conocerlo).
  const [guestHasReviewed, setGuestHasReviewed] = useState<boolean | null>(
    null,
  );

  useEffect(() => {
    if (!REVIEWABLE_STATUSES.includes(booking.status)) return;

    let mounted = true;
    setGuestHasReviewed(null);

    fetchMaybeBooking(client.rpc, address(booking.idPda))
      .then((account) => {
        if (!mounted) return;
        setGuestHasReviewed(
          account.exists ? account.data.hostReview > 0 : false,
        );
      })
      .catch(() => {
        if (mounted) setGuestHasReviewed(false);
      });

    return () => {
      mounted = false;
    };
  }, [booking, client.rpc]);

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
  const hostName = fullName(
    booking.hostValues.name,
    booking.hostValues.lastName,
    booking.hostValues.userProfile,
  );

  const handleAction = async (action: GuestBookingAction) => {
    if (action.disabled) return;

    if (action.id === "review") {
      setReviewOpen(true);
      return;
    }

    if (action.id === "dispute") {
      sileo.info({
        title: "Disponible próximamente",
        description:
          "La apertura de disputas se habilita en una próxima versión.",
      });
      return;
    }

    sileo.action({
      title: "¿Cancelar la reserva?",
      description: "Esta acción no se puede deshacer",
      position: "top-center",
      button: {
        title: "Cancelar la reserva",
        onClick: async () => {
          setBusy("cancel");
          try {
            const result = await run(booking, "cancel");
            if (result.status) onChanged?.();
          } finally {
            setBusy(null);
          }
        },
      },
    });
  };

  const actions = actionsForGuest(booking, guestHasReviewed);

  return (
    <>
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
            personName={hostName}
            personLabel="Anfitrión"
            price={formatPrice(booking.totalPrice)}
          />
        </div>

        <GuestBookingActions
          actions={actions}
          busy={busy}
          onAction={handleAction}
        />
      </article>

      <GuestReviewForm
        open={reviewOpen}
        booking={booking}
        onClose={() => setReviewOpen(false)}
        onSubmitted={() => onChanged?.()}
      />
    </>
  );
}
