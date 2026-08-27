import { getWalletAccountFromAddress } from "@dynamic-labs-sdk/client";
import type { SolanaWalletAccount } from "@dynamic-labs-sdk/solana";
import { signTransaction } from "@dynamic-labs-sdk/solana";
import type { Address, Base64EncodedWireTransaction } from "@solana/kit";
import { SendTransactionError, VersionedTransaction } from "@solana/web3.js";
import { useMemo, useState } from "react";
import { sileo } from "sileo";

import useNetwork from "@/hooks/useNetwork";
import { needsMoreSignatures } from "@/lib/contracts/utils/needsMoreSignatures";
import { serializeToBase64 } from "@/lib/contracts/utils/serializeToBase64";
import { relayerApi } from "@/lib/relayerApi";
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

      let cosignedTxBase64 = await relayerApi.cosign(
        serializeToBase64(transaction),
        wallet,
      );

      const cosignedTx = VersionedTransaction.deserialize(
        Buffer.from(cosignedTxBase64, "base64"),
      );

      if (needsMoreSignatures(cosignedTx)) {
        const { signedTransaction } = await signTransaction({
          walletAccount,
          transaction: cosignedTx,
        });

        cosignedTxBase64 = serializeToBase64(signedTransaction);
      }

      const signature = await client.rpc
        .sendTransaction(cosignedTxBase64 as Base64EncodedWireTransaction, {
          skipPreflight: true,
          encoding: "base64",
        })
        .send();
      setSignature(signature);

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
