import { getWalletAccountFromAddress } from "@dynamic-labs-sdk/client";
import type { SolanaWalletAccount } from "@dynamic-labs-sdk/solana";
import { signAndSendTransaction } from "@dynamic-labs-sdk/solana";
import type { Address } from "@solana/kit";
import type { VersionedTransaction } from "@solana/web3.js";
import { SendTransactionError } from "@solana/web3.js";
import { useMemo, useState } from "react";
import { sileo } from "sileo";

import useNetwork from "@/hooks/useNetwork";
import {
  DEFAULT_SIMULATION_ERROR,
  simulateVersionedTransaction,
} from "@/lib/simulateTransaction";
import type { SignAndSendTxResult } from "@/types/simulateTransaction";

export function useSignAndSendTx(wallet: Address | null) {
  const [signature, setSignature] = useState("");
  const [loading, setLoading] = useState(false);
  const { client } = useNetwork();

  const walletAccount = useMemo(() => {
    if (!wallet) return null;
    return getWalletAccountFromAddress({
      address: wallet.toString(),
      chain: "SOL",
    }) as SolanaWalletAccount | null;
  }, [wallet]);

  const handleSignAndSend = async <T extends VersionedTransaction>(
    transaction: T,
  ): Promise<SignAndSendTxResult> => {
    if (!wallet) return { status: false };
    if (!walletAccount) return { status: false };

    try {
      setLoading(true);

      // Pre-send gate: simulate the compiled transaction before asking the
      // wallet to sign and send it. On-chain errors are caught here, so the
      // real send (and its fees) is never attempted.
      const simulation = await simulateVersionedTransaction({
        client,
        transaction,
      });
      if (!simulation.ok) {
        console.error("Transaction simulation full error:", simulation.error);
        console.error("Transaction simulation failed:", simulation.error);
        sileo.error({
          title: simulation.error?.message ?? DEFAULT_SIMULATION_ERROR,
        });
        return {
          status: false,
          error: simulation.error,
          simulationFailed: true,
        };
      }

      const { signature } = await signAndSendTransaction({
        walletAccount,
        transaction,
      });

      setSignature(signature);
      console.log("Transaction sent:", signature);
      return { status: true, signature };
    } catch (error: unknown) {
      if (error instanceof SendTransactionError) {
        console.log("SendTransactionError:", error.logs);
      }

      console.log(error);
      return { status: false, error };
    } finally {
      setLoading(false);
    }
  };

  return { handleSignAndSend, signature, loading };
}
