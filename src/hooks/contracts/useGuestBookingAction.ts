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
import type { GuestBookingActionTx } from "@/lib/contracts/buildGuestBookingAction";
import { buildGuestBookingAction } from "@/lib/contracts/buildGuestBookingAction";
import type { Booking } from "@/types/api/booking";

const GUEST_ACTION_MESSAGES: Record<GuestBookingActionTx, string> = {
  cancel: "Reserva cancelada",
};

export interface GuestBookingActionResult {
  status: boolean;
  signature?: string;
  error?: unknown;
}

/** Builds, signs and sends the on-chain guest action for a booking (cancel). */
export function useGuestBookingAction() {
  const { userWallet } = useWalletContext();
  const { client } = useNetwork();
  const { handleSignAndSend, loading } = useSignAndSendTx(userWallet);

  const run = useCallback(
    async (
      booking: Booking,
      action: GuestBookingActionTx,
    ): Promise<GuestBookingActionResult> => {
      if (!userWallet || !booking.idPda) {
        sileo.error({ title: "Conecta tu wallet para continuar" });
        return { status: false };
      }

      try {
        const { tx } = await buildGuestBookingAction({
          action,
          wallet: userWallet,
          booking,
          client,
        });
        const result = await handleSignAndSend(tx);
        if (result.status) {
          sileo.success({ title: GUEST_ACTION_MESSAGES[action] });
        } else if (!result.simulationFailed) {
          sileo.error({
            title:
              getBookingErrorMessage(result.error) ?? DEFAULT_BOOKING_ERROR,
          });
        }
        return result as GuestBookingActionResult;
      } catch (error) {
        console.error(`Error building ${action} tx:`, error);
        sileo.error({ title: "Error preparando la transacción" });
        return { status: false, error };
      }
    },
    [client, handleSignAndSend, userWallet],
  );

  return { run, loading };
}
