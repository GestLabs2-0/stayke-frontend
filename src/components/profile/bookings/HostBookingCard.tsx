"use client";

import { address } from "@solana/kit";
import { useCallback, useEffect, useState } from "react";
import { sileo } from "sileo";

import { BookingStatus, fetchMaybeBooking } from "@GestLabs2-0/stayke-escrow";
import { formatDate } from "@/helpers/formatDate";
import { formatPrice } from "@/helpers/formatPrice";
import { propertyImageUrl } from "@/helpers/propertyImageUrl";
import { useHostBookingAction } from "@/hooks/contracts/useHostBookingAction";
import { useHostReviewAction } from "@/hooks/contracts/useHostReviewAction";
import useNetwork from "@/hooks/useNetwork";
import { useWalletContext } from "@/hooks/useWallet";
import type { HostBookingAction } from "@/lib/contracts/buildHostBookingAction";
import { staykeApi } from "@/lib/staykeApi";
import type { OnChainReviewResult } from "@/types/profile/bookingReview";
import type {
  BookingAction,
  HostBookingCardProps,
} from "@/types/profile/bookings";
import { BookingHeader } from "./BookingHeader";
import { BookingInfo } from "./BookingInfo";
import { BookingReviewForm } from "./BookingReviewForm";
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

/** Estados en los que el anfitrión puede reseñar al huésped. */
const REVIEWABLE_STATUSES = [BookingStatus.Completed, BookingStatus.Released];

function shortAddress(address: string) {
  if (address.length <= 12) return address;
  return `${address.slice(0, 4)}…${address.slice(-4)}`;
}

function fullName(name: string, lastName: string, fallback: string) {
  const full = `${name} ${lastName}`.trim();
  return full.length > 0 ? full : shortAddress(fallback);
}

export function HostBookingCard({ booking, onChanged }: HostBookingCardProps) {
  const { run, getEligibility } = useHostBookingAction();
  const { run: runReview } = useHostReviewAction();
  const { client } = useNetwork();
  const { userWallet } = useWalletContext();
  const [releaseReady, setReleaseReady] = useState(false);
  const [busy, setBusy] = useState<HostBookingAction | null>(null);
  const [reviewOpen, setReviewOpen] = useState(false);
  // Chequeo off-chain: si el backend ya tiene la reseña del anfitrión se oculta.
  const [hostHasReviewed, setHostHasReviewed] = useState<boolean | null>(null);

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

  useEffect(() => {
    if (!REVIEWABLE_STATUSES.includes(booking.status)) return;
    if (!userWallet) {
      setHostHasReviewed(null);
      return;
    }

    let mounted = true;
    setHostHasReviewed(null);

    staykeApi
      .getReviews({
        bookingPda: booking.idPda,
        reviewerPda: userWallet,
        limit: 1,
      })
      .then((result) => {
        if (!mounted) return;
        const exists = Array.isArray(result.data)
          ? result.data.length > 0
          : false;
        setHostHasReviewed(exists);
      })
      .catch(() => {
        if (mounted) setHostHasReviewed(false);
      });

    return () => {
      mounted = false;
    };
  }, [booking.idPda, booking.status, userWallet]);

  const onChainReview = useCallback(
    async (score: number): Promise<OnChainReviewResult> => {
      const account = await fetchMaybeBooking(
        client.rpc,
        address(booking.idPda),
      );
      if (account.exists && account.data.guestReview > 0) {
        return { ok: false, already: true };
      }
      const result = await runReview(booking, score);
      return result.status ? { ok: true } : { ok: false, already: false };
    },
    [booking, client.rpc, runReview],
  );

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

    // Tras descartar review/dispute, `action.id` ya es una acción de anfitrión.
    const hostAction = action.id;
    const confirm = CONFIRM_MESSAGES[hostAction];

    if (!confirm) return;

    const { title, description } = confirm;
    sileo.action({
      title,
      description,
      position: "top-center",
      button: {
        title,
        onClick: async () => {
          setBusy(hostAction);
          try {
            const result = await run(booking, hostAction);
            if (result.status) onChanged?.();
          } finally {
            setBusy(null);
          }
        },
      },
    });
  };

  const actions = actionsFor(booking, releaseReady, hostHasReviewed);

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

      <BookingReviewForm
        open={reviewOpen}
        booking={booking}
        isHostReview={false}
        onChainReview={onChainReview}
        onClose={() => setReviewOpen(false)}
        onSubmitted={() => onChanged?.()}
      />
    </>
  );
}
