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
import { buildHostReviewAction } from "@/lib/contracts/buildHostReviewAction";
import type { Booking } from "@/types/api/booking";

export interface HostReviewActionResult {
  status: boolean;
  signature?: string;
  error?: unknown;
}

/**
 * Builds, signs and sends the on-chain `hostReview` instruction. On success it
 * sets `booking.guestReview = score` on-chain.
 */
export function useHostReviewAction() {
  const { userWallet } = useWalletContext();
  const { client } = useNetwork();
  const { handleSignAndSend, loading } = useSignAndSendTx(userWallet);

  const run = useCallback(
    async (
      booking: Booking,
      score: number,
    ): Promise<HostReviewActionResult> => {
      if (!userWallet || !booking.idPda) {
        sileo.error({ title: "Conecta tu wallet para continuar" });
        return { status: false };
      }

      try {
        const { tx } = await buildHostReviewAction({
          wallet: userWallet,
          booking,
          client,
          score,
        });
        const result = await handleSignAndSend(tx);
        if (result.status) {
          sileo.success({ title: "¡Reseña guardada on-chain!" });
        } else {
          sileo.error({
            title:
              getBookingErrorMessage(result.error) ?? DEFAULT_BOOKING_ERROR,
          });
        }
        return result as HostReviewActionResult;
      } catch (error) {
        console.error("Error building hostReview tx:", error);
        sileo.error({ title: "Error preparando la transacción" });
        return { status: false, error };
      }
    },
    [client, handleSignAndSend, userWallet],
  );

  return { run, loading };
}
