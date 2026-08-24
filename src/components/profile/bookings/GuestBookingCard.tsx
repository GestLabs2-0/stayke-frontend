"use client";

import { address } from "@solana/kit";
import { useCallback, useEffect, useState } from "react";
import { sileo } from "sileo";

import { BookingStatus, fetchMaybeBooking } from "@GestLabs2-0/stayke-escrow";
import { isBookingExpiredSync } from "@/helpers/bookingExpiration";
import { buildImageUrl } from "@/helpers/buildImageUrl";
import { formatDate } from "@/helpers/formatDate";
import { formatPrice } from "@/helpers/formatPrice";
import { fullName } from "@/helpers/profileNames";
import { useGuestBookingAction } from "@/hooks/contracts/useGuestBookingAction";
import { useGuestReviewAction } from "@/hooks/contracts/useGuestReviewAction";
import { useOpenDisputeAction } from "@/hooks/contracts/useOpenDisputeAction";
import { useBookingReviewCheck } from "@/hooks/useBookingReviewCheck";
import useNetwork from "@/hooks/useNetwork";
import { useWalletContext } from "@/hooks/useWallet";
import type { OnChainReviewResult } from "@/types/profile/bookingReview";
import type {
  GuestBookingAction,
  GuestBookingActionId,
  GuestBookingCardProps,
} from "@/types/profile/bookings";
import { BookingHeader } from "./BookingHeader";
import { BookingInfo } from "./BookingInfo";
import { BookingReviewForm } from "./BookingReviewForm";
import { BookingThumbnail } from "./BookingThumbnail";
import {
  STATUS_BADGE_CLASSES,
  STATUS_DOT_CLASSES,
} from "./bookingStatusStyles";
import { GuestBookingActions } from "./GuestBookingActions";
import { actionsForGuest } from "./guestActions";

export function GuestBookingCard({
  booking,
  onChanged,
}: GuestBookingCardProps) {
  const { run, getExpirationEligibility } = useGuestBookingAction();
  const { run: runReview } = useGuestReviewAction();
  const { run: openDispute } = useOpenDisputeAction();
  const { client } = useNetwork();
  const { userWallet } = useWalletContext();
  const [busy, setBusy] = useState<GuestBookingActionId | null>(null);
  const [reviewOpen, setReviewOpen] = useState(false);
  const [isExpired, setIsExpired] = useState(() =>
    isBookingExpiredSync(booking),
  );
  const guestHasReviewed = useBookingReviewCheck(booking, userWallet);

  useEffect(() => {
    let mounted = true;
    if (booking.status === BookingStatus.Pending) {
      if (isBookingExpiredSync(booking)) {
        setIsExpired(true);
      } else {
        getExpirationEligibility(booking).then((exp) => {
          if (mounted) setIsExpired(exp);
        });
      }
    }
    return () => {
      mounted = false;
    };
  }, [booking, getExpirationEligibility]);

  const onChainReview = useCallback(
    async (score: number): Promise<OnChainReviewResult> => {
      const acc = await fetchMaybeBooking(client.rpc, address(booking.idPda));
      if (acc.exists && acc.data.hostReview > 0)
        return { ok: false, already: true };
      const res = await runReview(booking, score);
      return res.status ? { ok: true } : { ok: false, already: false };
    },
    [booking, client.rpc, runReview],
  );

  const handleAction = async (action: GuestBookingAction) => {
    if (action.disabled) return;
    if (action.id === "review") return setReviewOpen(true);
    if (action.id === "dispute") {
      return sileo.action({
        title: "¿Iniciar disputa?",
        description: "La disputa se resolverá entre las partes.",
        position: "top-center",
        button: {
          title: "Iniciar disputa",
          onClick: async () => {
            const res = await openDispute(booking, booking.guest.userProfile);
            if (res.status) onChanged?.();
          },
        },
      });
    }

    if (action.id === "expire") {
      return sileo.action({
        title: "¿Expirar la reserva?",
        description:
          "Han transcurrido más de 24 horas sin respuesta. Se te reembolsarán los fondos.",
        position: "top-center",
        button: {
          title: "Expirar reserva",
          onClick: async () => {
            setBusy("expire");
            try {
              const res = await run(booking, "expire");
              if (res.status) onChanged?.();
            } finally {
              setBusy(null);
            }
          },
        },
      });
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
            const res = await run(booking, "cancel");
            if (res.status) onChanged?.();
          } finally {
            setBusy(null);
          }
        },
      },
    });
  };

  const hostName = fullName(
    booking.host.name,
    booking.host.lastName,
    booking.host.userProfile,
  );
  const actions = actionsForGuest(booking, guestHasReviewed, isExpired);

  return (
    <>
      <article className="card-white flex flex-col gap-4 p-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md sm:flex-row sm:items-center">
        <BookingThumbnail
          imageSrc={buildImageUrl(booking.property.imageKey)}
          title={booking.property.title}
        />
        <div className="min-w-0 flex-1 space-y-2">
          <BookingHeader
            title={booking.property.title}
            status={booking.status}
            statusDotClass={STATUS_DOT_CLASSES[booking.status]}
            statusBadgeClass={STATUS_BADGE_CLASSES[booking.status]}
          />
          <BookingInfo
            location={[booking.property.city, booking.property.countryCode]
              .filter(Boolean)
              .join(", ")}
            rangeLabel={`${formatDate(booking.checkIn)} – ${formatDate(booking.checkOut)}`}
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
      <BookingReviewForm
        open={reviewOpen}
        booking={booking}
        isHostReview
        onChainReview={onChainReview}
        onClose={() => setReviewOpen(false)}
        onSubmitted={() => onChanged?.()}
      />
    </>
  );
}
