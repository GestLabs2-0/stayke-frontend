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
import { buildSolveDisputeBeforeAdminAction } from "@/lib/contracts/buildSolveDisputeBeforeAdminAction";
import type { Dispute } from "@/types/api/disputes";
import { DisputeParty } from "@/types/api/disputes";

export interface SolveDisputeActionResult {
  status: boolean;
  signature?: string;
  error?: unknown;
}

/** Builds, signs and sends the on-chain `solveDisputeBeforeAdmin` instruction. */
export function useSolveDisputeBeforeAdminAction() {
  const { userWallet, userProfile } = useWalletContext();
  const { client } = useNetwork();
  const { handleSignAndSend, loading } = useSignAndSendTx(userWallet);

  const run = useCallback(
    async (dispute: Dispute): Promise<SolveDisputeActionResult> => {
      if (!userWallet || !dispute.bookingPda) {
        sileo.error({ title: "Conecta tu wallet para continuar" });
        return { status: false };
      }

      const openerProfile =
        dispute.openedBy === DisputeParty.Guest
          ? dispute.booking.guest_profile_pda
          : dispute.booking.host_profile_pda;

      const initiatorProfilePda = userProfile?.address ?? openerProfile;

      if (!isAddress(initiatorProfilePda)) {
        sileo.error({
          title: "Datos de perfil no válidos",
          description: "No se pudo derivar la cuenta de perfil del iniciador.",
        });
        return { status: false };
      }

      try {
        const { tx } = await buildSolveDisputeBeforeAdminAction({
          wallet: userWallet,
          initiatorProfile: address(initiatorProfilePda),
          bookingId: address(dispute.bookingPda),
          client,
        });

        const result = await handleSignAndSend(tx);
        if (result.status) {
          sileo.success({
            title: "Disputa resuelta",
            description:
              "La disputa se ha resuelto entre las partes exitosamente.",
          });
        } else if (!result.simulationFailed) {
          sileo.error({
            title:
              getDisputeErrorMessage(result.error) ?? DEFAULT_DISPUTE_ERROR,
          });
        }
        return result as SolveDisputeActionResult;
      } catch (error) {
        console.error("Error building solveDisputeBeforeAdmin tx:", error);
        sileo.error({ title: "Error preparando la transacción" });
        return { status: false, error };
      }
    },
    [client, handleSignAndSend, userProfile?.address, userWallet],
  );

  return { run, loading };
}
