"use client";

import { address } from "@solana/kit";
import { useCallback } from "react";
import { sileo } from "sileo";

import { fetchMaybeBooking } from "@GestLabs2-0/stayke-escrow";
import {
  DEFAULT_BOOKING_ERROR,
  getBookingErrorMessage,
} from "@/helpers/bookingErrors";
import useNetwork from "@/hooks/useNetwork";
import { useSignAndSendTx } from "@/hooks/useSignAndSendTx";
import { useWalletContext } from "@/hooks/useWallet";
import type { HostBookingAction } from "@/lib/contracts/buildHostBookingAction";
import { buildHostBookingAction } from "@/lib/contracts/buildHostBookingAction";
import type { Booking } from "@/types/api/booking";

/** On-chain dispute window: funds are releasable 24h after the last status change. */
const RELEASE_WINDOW_SECONDS = 24 * 60 * 60;

const HOST_ACTION_MESSAGES: Record<HostBookingAction, string> = {
  accept: "Reserva aceptada",
  reject: "Reserva rechazada",
  cancel: "Reserva cancelada",
  starts: "La estadía comenzó",
  completes: "Reserva completada",
  release: "Fondos liberados",
};

export interface HostBookingActionResult {
  status: boolean;
  signature?: string;
  error?: unknown;
}

/**
 * Builds, signs and sends the on-chain host action for a booking. `starts` and
 * `release` are gated by the 24h window from the booking's `updated_at`.
 */
export function useHostBookingAction() {
  const { userWallet } = useWalletContext();
  const { client } = useNetwork();
  const { handleSignAndSend, loading } = useSignAndSendTx(userWallet);

  const getEligibility = useCallback(
    async (booking: Booking): Promise<boolean> => {
      try {
        const account = await fetchMaybeBooking(
          client.rpc,
          address(booking.idPda),
        );
        if (!account.exists) return false;
        const updatedAt = Number(account.data.updatedAt);
        return Date.now() / 1000 >= updatedAt + RELEASE_WINDOW_SECONDS;
      } catch (error) {
        console.error("Error fetching booking updated_at:", error);
        return false;
      }
    },
    [client.rpc],
  );

  const run = useCallback(
    async (
      booking: Booking,
      action: HostBookingAction,
    ): Promise<HostBookingActionResult> => {
      if (!userWallet || !booking.idPda) {
        sileo.error({ title: "Conecta tu wallet para continuar" });
        return { status: false };
      }

      if (action === "starts" || action === "release") {
        const ready = await getEligibility(booking);
        if (!ready) {
          sileo.info({
            title: "Aún no disponible",
            description:
              "Esta acción estará disponible una vez transcurridas 24 horas.",
          });
          return { status: false };
        }
      }

      try {
        const { tx } = await buildHostBookingAction({
          action,
          wallet: userWallet,
          booking,
          client,
        });
        const result = await handleSignAndSend(tx);
        if (result.status) {
          sileo.success({ title: HOST_ACTION_MESSAGES[action] });
        } else if (!result.simulationFailed) {
          sileo.error({
            title:
              getBookingErrorMessage(result.error) ?? DEFAULT_BOOKING_ERROR,
          });
        }
        return result as HostBookingActionResult;
      } catch (error) {
        console.error(`Error building ${action} tx:`, error);
        sileo.error({ title: "Error preparando la transacción" });
        return { status: false, error };
      }
    },
    [client, getEligibility, handleSignAndSend, userWallet],
  );

  return { run, loading, getEligibility };
}
