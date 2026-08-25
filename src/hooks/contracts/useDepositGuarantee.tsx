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
import { buildDepositGuarantee } from "@/lib/contracts/buildDepositGuarantee";

export interface DepositGuaranteeActionResult {
  status: boolean;
  signature?: string;
  error?: unknown;
}

/** Builds, signs and sends the on-chain `depositGuarantee` transaction to the treasury. */
export function useDepositGuarantee() {
  const { userWallet, refetchAccounts } = useWalletContext();
  const { client } = useNetwork();
  const { handleSignAndSend, loading } = useSignAndSendTx(userWallet);

  const run = useCallback(
    async (rawAmount: number): Promise<DepositGuaranteeActionResult> => {
      if (!userWallet) {
        sileo.error({ title: "Conecta tu wallet para continuar" });
        return { status: false };
      }

      if (!rawAmount || rawAmount <= 0) {
        sileo.error({ title: "Ingresa un monto válido mayor a 0" });
        return { status: false };
      }

      try {
        const { tx } = await buildDepositGuarantee({
          wallet: userWallet,
          rawAmount,
          client,
        });
        const result = await handleSignAndSend(tx);
        if (result.status) {
          sileo.success({ title: "Garantía depositada con éxito" });
          await refetchAccounts();
        } else if (!result.simulationFailed) {
          sileo.error({
            title:
              getTreasuryErrorMessage(result.error) ?? DEFAULT_TREASURY_ERROR,
          });
        }
        return result as DepositGuaranteeActionResult;
      } catch (error) {
        console.error("Error building depositGuarantee tx:", error);
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
