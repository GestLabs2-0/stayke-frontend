"use client";

import { useEffect, useState } from "react";

import { BookingStatus } from "@GestLabs2-0/stayke-escrow";
import { staykeApi } from "@/lib/staykeApi";
import type { Booking } from "@/types/api/booking";

const REVIEWABLE_STATUSES = [BookingStatus.Completed, BookingStatus.Released];

/**
 * Consulta off-chain si el usuario ya dejó una reseña para la reserva dada.
 * Retorna boolean o null mientras está cargando / no aplica.
 */
export function useBookingReviewCheck(
  booking: Booking,
  userWallet: string | null | undefined,
): boolean | null {
  const [hasReviewed, setHasReviewed] = useState<boolean | null>(null);

  useEffect(() => {
    if (!REVIEWABLE_STATUSES.includes(booking.status) || !userWallet) {
      setHasReviewed(null);
      return;
    }

    let mounted = true;
    setHasReviewed(null);

    staykeApi
      .getReviews({
        bookingPda: booking.idPda,
        reviewerPda: userWallet,
        limit: 1,
      })
      .then((res) => {
        if (!mounted) return;
        setHasReviewed(Array.isArray(res.data) && res.data.length > 0);
      })
      .catch(() => {
        if (mounted) setHasReviewed(false);
      });

    return () => {
      mounted = false;
    };
  }, [booking.idPda, booking.status, userWallet]);

  return hasReviewed;
}
