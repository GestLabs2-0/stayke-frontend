"use client";

import { address, isAddress } from "@solana/kit";
import { useCallback } from "react";
import { sileo } from "sileo";

import {
  DEFAULT_DISPUTE_ERROR,
  getDisputeErrorMessage,
} from "@/helpers/disputeErrors";
import useNetwork from "@/hooks/useNetwork";
import { useSignAndSendTx } from "@/hooks/useSignAndSendTx";
import { useWalletContext } from "@/hooks/useWallet";
import { buildCloseDisputeAction } from "@/lib/contracts/buildCloseDisputeAction";
import type { Dispute } from "@/types/api/disputes";
import { DisputeParty } from "@/types/api/disputes";

export interface CloseDisputeActionResult {
  status: boolean;
  signature?: string;
  error?: unknown;
}

/** Builds, signs and sends the on-chain `closeDispute` instruction (permissionless). */
export function useCloseDisputeAction() {
  const { userWallet } = useWalletContext();
  const { client } = useNetwork();
  const { handleSignAndSend, loading } = useSignAndSendTx(userWallet);

  const run = useCallback(
    async (dispute: Dispute): Promise<CloseDisputeActionResult> => {
      if (!userWallet || !dispute.bookingPda) {
        sileo.error({ title: "Conecta tu wallet para continuar" });
        return { status: false };
      }

      const openerProfile =
        dispute.openedBy === DisputeParty.Guest
          ? dispute.booking.guest_profile_pda
          : dispute.booking.host_profile_pda;

      if (
        !isAddress(dispute.booking.guest_profile_pda) ||
        !isAddress(dispute.booking.host_profile_pda) ||
        !isAddress(openerProfile)
      ) {
        sileo.error({
          title: "Datos de disputa incompletos",
          description:
            "No se pudieron derivar las cuentas de perfil necesarias.",
        });
        return { status: false };
      }

      try {
        const { tx } = await buildCloseDisputeAction({
          wallet: userWallet,
          bookingId: address(dispute.bookingPda),
          guestProfile: address(dispute.booking.guest_profile_pda),
          hostProfile: address(dispute.booking.host_profile_pda),
          openerProfile: address(openerProfile),
          client,
        });

        const result = await handleSignAndSend(tx);
        if (result.status) {
          sileo.success({
            title: "Disputa cerrada",
            description: "La disputa se ha cerrado y el rent ha sido devuelto.",
          });
        } else if (!result.simulationFailed) {
          sileo.error({
            title:
              getDisputeErrorMessage(result.error) ?? DEFAULT_DISPUTE_ERROR,
          });
        }
        return result as CloseDisputeActionResult;
      } catch (error) {
        console.error("Error building closeDispute tx:", error);
        sileo.error({ title: "Error preparando la transacción" });
        return { status: false, error };
      }
    },
    [client, handleSignAndSend, userWallet],
  );

  return { run, loading };
}
