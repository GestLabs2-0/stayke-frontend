import { getWalletAccounts } from "@dynamic-labs-sdk/client";
import { signAndSendTransaction } from "@dynamic-labs-sdk/solana";
import type {
  Transaction,
  TransactionWithBlockhashLifetime,
} from "@solana/kit";
import { getTransactionEncoder } from "@solana/kit";
import { VersionedMessage, VersionedTransaction } from "@solana/web3.js";
import { useMemo, useState } from "react";

import { useWalletContext } from "./useWallet";

const encoder = getTransactionEncoder();
export function useSignTx() {
  // TODO: expand hook to sign and send transactions depending on wallet type
  const { userWallet } = useWalletContext();

  const [signature, setSignature] = useState("");
  const walletAccount = useMemo(() => {
    const wallets = getWalletAccounts();
    if (!userWallet) return null;
    if (wallets.length > 0 && wallets[0].address === userWallet.toString())
      return wallets[0];
    return null;
  }, [userWallet]);

  const handleSignAndSend = async <
    T extends Transaction & TransactionWithBlockhashLifetime,
  >(
    transaction: T,
  ) => {
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
