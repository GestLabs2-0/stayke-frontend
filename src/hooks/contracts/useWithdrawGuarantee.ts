"use client";

import { useCallback } from "react";
import { sileo } from "sileo";

import {
  DEFAULT_TREASURY_ERROR,
  getTreasuryErrorMessage,
} from "@/helpers/treasuryErrors";
import useNetwork from "@/hooks/useNetwork";
import { useSignAndSendTx } from "@/hooks/useSignAndSendTx";
import { useWalletContext } from "@/hooks/useWallet";
import { buildWithdrawGuarantee } from "@/lib/contracts/buildWithdrawGuarantee";

export interface WithdrawGuaranteeActionResult {
  status: boolean;
  signature?: string;
  error?: unknown;
}

/** Builds, signs and sends the on-chain `withdrawGuarantee` transaction to the treasury. */
export function useWithdrawGuarantee() {
  const { userWallet, refetchAccounts } = useWalletContext();
  const { client } = useNetwork();
  const { handleSignAndSend, loading } = useSignAndSendTx(userWallet);

  const run = useCallback(
    async (rawAmount: number): Promise<WithdrawGuaranteeActionResult> => {
      if (!userWallet) {
        sileo.error({ title: "Conecta tu wallet para continuar" });
        return { status: false };
      }

      if (!rawAmount || rawAmount <= 0) {
        sileo.error({ title: "Ingresa un monto válido mayor a 0" });
        return { status: false };
      }

      try {
        const { tx } = await buildWithdrawGuarantee({
          wallet: userWallet,
          rawAmount,
          client,
        });
        const result = await handleSignAndSend(tx);
        if (result.status) {
          sileo.success({ title: "Garantía retirada con éxito" });
          await refetchAccounts();
        } else if (!result.simulationFailed) {
          sileo.error({
            title:
              getTreasuryErrorMessage(result.error) ?? DEFAULT_TREASURY_ERROR,
          });
        }
        return result as WithdrawGuaranteeActionResult;
      } catch (error) {
        console.error("Error building withdrawGuarantee tx:", error);
        sileo.error({
          title:
            getTreasuryErrorMessage(error) ?? "Error preparando la transacción",
        });
        return { status: false, error };
      }
    },
    [client, handleSignAndSend, userWallet, refetchAccounts],
  );

  return { run, loading };
}
