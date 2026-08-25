"use client";

import { useCallback } from "react";
import { sileo } from "sileo";

import {
  DEFAULT_BOOKING_ERROR,
  getBookingErrorMessage,
} from "@/helpers/bookingErrors";
import useNetwork from "@/hooks/useNetwork";
import { useSignAndSendTx } from "@/hooks/useSignAndSendTx";
import { useWalletContext } from "@/hooks/useWallet";
import { buildGuestReviewAction } from "@/lib/contracts/buildGuestReviewAction";
import type { Booking } from "@/types/api/booking";

export interface GuestReviewActionResult {
  status: boolean;
  signature?: string;
  error?: unknown;
}

/**
 * Builds, signs and sends the on-chain `guestReview` instruction. On success it
 * sets `booking.hostReview = score` on-chain.
 */
export function useGuestReviewAction() {
  const { userWallet } = useWalletContext();
  const { client } = useNetwork();
  const { handleSignAndSend, loading } = useSignAndSendTx(userWallet);

  const run = useCallback(
    async (
      booking: Booking,
      score: number,
    ): Promise<GuestReviewActionResult> => {
      if (!userWallet || !booking.idPda) {
        sileo.error({ title: "Conecta tu wallet para continuar" });
        return { status: false };
      }

      try {
        const { tx } = await buildGuestReviewAction({
          wallet: userWallet,
          booking,
          client,
          score,
        });
        const result = await handleSignAndSend(tx);
        if (result.status) {
          sileo.success({ title: "¡Reseña guardada on-chain!" });
        } else if (!result.simulationFailed) {
          sileo.error({
            title:
              getBookingErrorMessage(result.error) ?? DEFAULT_BOOKING_ERROR,
          });
        }
        return result as GuestReviewActionResult;
      } catch (error) {
        console.error("Error building guestReview tx:", error);
        sileo.error({ title: "Error preparando la transacción" });
        return { status: false, error };
      }
    },
    [client, handleSignAndSend, userWallet],
  );

  return { run, loading };
}
