import { getWalletAccountFromAddress } from "@dynamic-labs-sdk/client";
import type { SolanaWalletAccount } from "@dynamic-labs-sdk/solana";
import { signAndSendTransaction } from "@dynamic-labs-sdk/solana";
import type {
  Address,
  Transaction,
  TransactionWithBlockhashLifetime,
} from "@solana/kit";
import { getTransactionEncoder } from "@solana/kit";
import { VersionedMessage, VersionedTransaction } from "@solana/web3.js";
import { useState } from "react";
import { sileo } from "sileo";

const encoder = getTransactionEncoder();
export function useSignAndSendTx(wallet: Address | null) {
  // TODO: expand hook to sign and send transactions depending on wallet type
  const [signature, setSignature] = useState("");

  const [loading, setLoading] = useState(false);

  const handleSignAndSend = async <
    T extends Transaction & TransactionWithBlockhashLifetime,
  >(
    transaction: T,
  ) => {
    if (!wallet) return { status: false };

    const walletAccount = getWalletAccountFromAddress({
      address: wallet?.toString(),
      chain: "SOL",
    }) as SolanaWalletAccount | null;
    if (!walletAccount) return { status: false };

    const wireBytes = new Uint8Array(encoder.encode(transaction));
    const versionedMessage = VersionedMessage.deserialize(wireBytes);
    const tx = new VersionedTransaction(versionedMessage);
    try {
      setLoading(true);
      const { signature } = await signAndSendTransaction({
        walletAccount,
        transaction: tx,
      });

      setSignature(signature);
      console.log("Transaction sent:", signature);
      return {
        status: true,
      };
    } catch (error) {
      sileo.error({
        title: "Error enviando la transacción. Por favor, inténtalo de nuevo.",
      });
      console.log(error);
    } finally {
      setLoading(false);
    }
    return {
      status: false,
    };
  };

  return {
    handleSignAndSend,
    signature,
    loading,
  };
}
