"use client";

import { address } from "@solana/kit";
import { useCallback } from "react";
import { sileo } from "sileo";

import {
  DEFAULT_BOOKING_ERROR,
  getBookingErrorMessage,
} from "@/helpers/bookingErrors";
import useNetwork from "@/hooks/useNetwork";
import { useSignAndSendTx } from "@/hooks/useSignAndSendTx";
import { useWalletContext } from "@/hooks/useWallet";
import { buildOpenDisputeAction } from "@/lib/contracts/buildOpenDisputeAction";
import type { Booking } from "@/types/api/booking";

export interface OpenDisputeActionResult {
  status: boolean;
  signature?: string;
  error?: unknown;
}

/** Builds, signs and sends the on-chain `openDispute` (P2P) for a booking. */
export function useOpenDisputeAction() {
  const { userWallet } = useWalletContext();
  const { client } = useNetwork();
  const { handleSignAndSend, loading } = useSignAndSendTx(userWallet);

  const run = useCallback(
    async (
      booking: Booking,
      initiatorProfile: string,
    ): Promise<OpenDisputeActionResult> => {
      if (!userWallet || !booking.idPda) {
        sileo.error({ title: "Conecta tu wallet para continuar" });
        return { status: false };
      }

      try {
        const { tx } = await buildOpenDisputeAction({
          wallet: userWallet,
          initiatorProfile: address(initiatorProfile),
          bookingId: address(booking.idPda),
          client,
        });
        const result = await handleSignAndSend(tx);
        if (result.status) {
          sileo.success({ title: "Disputa abierta" });
        } else if (!result.simulationFailed) {
          sileo.error({
            title:
              getBookingErrorMessage(result.error) ?? DEFAULT_BOOKING_ERROR,
          });
        }
        return result as OpenDisputeActionResult;
      } catch (error) {
        console.error("Error building openDispute tx:", error);
        sileo.error({ title: "Error preparando la transacción" });
        return { status: false, error };
      }
    },
    [client, handleSignAndSend, userWallet],
  );

  return { run, loading };
}
