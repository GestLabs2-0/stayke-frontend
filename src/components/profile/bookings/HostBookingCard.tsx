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
import { useHostBookingAction } from "@/hooks/contracts/useHostBookingAction";
import { useHostReviewAction } from "@/hooks/contracts/useHostReviewAction";
import { useOpenDisputeAction } from "@/hooks/contracts/useOpenDisputeAction";
import { useBookingReviewCheck } from "@/hooks/useBookingReviewCheck";
import useNetwork from "@/hooks/useNetwork";
import { useWalletContext } from "@/hooks/useWallet";
import type { HostBookingAction } from "@/lib/contracts/buildHostBookingAction";
import type { OnChainReviewResult } from "@/types/profile/bookingReview";
import type {
  BookingAction,
  HostBookingCardProps,
} from "@/types/profile/bookings";
import { BookingHeader } from "./BookingHeader";
import { BookingInfo } from "./BookingInfo";
import { BookingReviewForm } from "./BookingReviewForm";
import { BookingThumbnail } from "./BookingThumbnail";
import { HOST_CONFIRM_MESSAGES } from "./bookingActionMessages";
import { actionsFor } from "./bookingActions";
import {
  STATUS_BADGE_CLASSES,
  STATUS_DOT_CLASSES,
} from "./bookingStatusStyles";
import { HostBookingActions } from "./HostBookingActions";

export function HostBookingCard({ booking, onChanged }: HostBookingCardProps) {
  const { run, getEligibility, getExpirationEligibility } =
    useHostBookingAction();
  const { run: runReview } = useHostReviewAction();
  const { run: openDispute } = useOpenDisputeAction();
  const { client } = useNetwork();
  const { userWallet } = useWalletContext();
  const [releaseReady, setReleaseReady] = useState(false);
  const [isExpired, setIsExpired] = useState(() =>
    isBookingExpiredSync(booking),
  );
  const [busy, setBusy] = useState<HostBookingAction | null>(null);
  const [reviewOpen, setReviewOpen] = useState(false);
  const hostHasReviewed = useBookingReviewCheck(booking, userWallet);

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
    } else if (
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
  }, [booking, getEligibility, getExpirationEligibility]);

  const onChainReview = useCallback(
    async (score: number): Promise<OnChainReviewResult> => {
      const acc = await fetchMaybeBooking(client.rpc, address(booking.idPda));
      if (acc.exists && acc.data.guestReview > 0)
        return { ok: false, already: true };
      const res = await runReview(booking, score);
      return res.status ? { ok: true } : { ok: false, already: false };
    },
    [booking, client.rpc, runReview],
  );

  const handleAction = async (action: BookingAction) => {
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
            const res = await openDispute(booking, booking.host.userProfile);
            if (res.status) onChanged?.();
          },
        },
      });
    }
    const hostAction = action.id;
    const confirm = HOST_CONFIRM_MESSAGES[hostAction];
    if (!confirm) return;
    sileo.action({
      title: confirm.title,
      description: confirm.description,
      position: "top-center",
      button: {
        title: confirm.title,
        onClick: async () => {
          setBusy(hostAction);
          try {
            const res = await run(booking, hostAction);
            if (res.status) onChanged?.();
          } finally {
            setBusy(null);
          }
        },
      },
    });
  };

  const guestName = fullName(
    booking.guest.name,
    booking.guest.lastName,
    booking.guest.userProfile,
  );
  const actions = actionsFor(booking, releaseReady, hostHasReviewed, isExpired);

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
