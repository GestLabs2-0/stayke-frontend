import { getWalletAccountFromAddress } from "@dynamic-labs-sdk/client";
import type { SolanaWalletAccount } from "@dynamic-labs-sdk/solana";
import { signAndSendTransaction } from "@dynamic-labs-sdk/solana";
import type { Address } from "@solana/kit";
import type { VersionedTransaction } from "@solana/web3.js";
import { SendTransactionError } from "@solana/web3.js";
import { useMemo, useState } from "react";
import { sileo } from "sileo";

export function useSignAndSendTx(wallet: Address | null) {
  const [signature, setSignature] = useState("");
  const [loading, setLoading] = useState(false);

  const walletAccount = useMemo(() => {
    if (!wallet) return null;
    return getWalletAccountFromAddress({
      address: wallet.toString(),
      chain: "SOL",
    }) as SolanaWalletAccount | null;
  }, [wallet]);

  const handleSignAndSend = async <T extends VersionedTransaction>(
    transaction: T,
  ) => {
    if (!wallet) return { status: false };
    if (!walletAccount) return { status: false };

    try {
      setLoading(true);

      const { signature } = await signAndSendTransaction({
        walletAccount,
        transaction,
      });

      setSignature(signature);
      console.log("Transaction sent:", signature);
      return { status: true, signature };
    } catch (error: unknown) {
      sileo.error({
        title: "Error enviando la transacción. Por favor, inténtalo de nuevo.",
      });

      if (error instanceof SendTransactionError) {
        console.log("SendTransactionError:", error.logs);
      }

      console.log(error);
    } finally {
      setLoading(false);
    }
    return { status: false };
  };

  return { handleSignAndSend, signature, loading };
}
