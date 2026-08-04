import { getWalletAccounts } from "@dynamic-labs-sdk/client";
import { signAndSendTransaction } from "@dynamic-labs-sdk/solana";
import type {
  Transaction,
  TransactionWithBlockhashLifetime,
} from "@solana/kit";
import { getTransactionEncoder } from "@solana/kit";
import { VersionedMessage, VersionedTransaction } from "@solana/web3.js";
import { useState } from "react";

const encoder = getTransactionEncoder();
export function useSignTx<
  T extends Transaction & TransactionWithBlockhashLifetime,
>(transaction: T) {
  // TODO: expand hook to sign and send transactions depending on wallet type
  const [signature, setSignature] = useState("");

  const wallets = getWalletAccounts();
  let walletAccount = null;

  if (wallets && wallets.length > 0) walletAccount = wallets[0];

  const handleSignAndSend = async () => {
    if (!walletAccount) return;
    const wireBytes = new Uint8Array(encoder.encode(transaction));
    const versionedMessage = VersionedMessage.deserialize(wireBytes);
    const tx = new VersionedTransaction(versionedMessage);

    const { signature } = await signAndSendTransaction({
      walletAccount,
      transaction: tx,
    });

    setSignature(signature);
    console.log("Transaction sent:", signature);
  };

  return {
    handleSignAndSend,
    signature,
  };
}
