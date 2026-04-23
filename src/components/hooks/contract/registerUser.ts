"use client";
import {
  getInitializeUserProfileInstruction,
  findUserProfilePda,
  findIdentityPda,
  findReputationProfilePda,
} from "@/src/generated/stayke_core";
import type { registerUserOnChain } from "@/src/types/staykeWeb3";
import {
  address,
  appendTransactionMessageInstructions,
  compileTransaction,
  createNoopSigner,
  createTransactionMessage,
  pipe,
  setTransactionMessageFeePayerSigner,
  setTransactionMessageLifetimeUsingBlockhash,
  assertIsTransactionWithinSizeLimit,
  getSignatureFromTransaction,
} from "@solana/kit";
import { useState } from "react";
import { toast } from "sonner";
import { useCluster } from "../../cluster-context";

export const useRegisterUser = ({
  props,
  id,
  doctype,
  countryCode,
}: registerUserOnChain) => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { connected, ready, rpc, signer, wallet, sendAndConfirm } = props;
  const getSolanaExplorerTx = useCluster().getExplorerUrl;

  const registerUser = async () => {
    if (!connected || !ready || !signer || !wallet) {
      throw new Error("Wallet not connected or ready");
    }
    const authorityAddr = address(wallet.address);

    try {
      setLoading(true);
      let userProfilePda = await findUserProfilePda({
        authority: authorityAddr,
      });
      let identityPda = await findIdentityPda({
        id: new Uint8Array([0, 0, 0, 0]),
      });
      let reputationProfilePda = await findReputationProfilePda({
        authority: authorityAddr,
      });
      let authority = createNoopSigner(authorityAddr);

      let registerInstruction = getInitializeUserProfileInstruction({
        authority,
        countryCode,
        doctype,
        id,
        userProfile: userProfilePda[0],
        identity: identityPda[0],
        reputationProfile: reputationProfilePda[0],
      });
      const { value: latestBlockhash } = await rpc.getLatestBlockhash().send();

      const tx = pipe(
        createTransactionMessage({ version: 0 }),
        (tx) => setTransactionMessageFeePayerSigner(authority, tx),
        (tx) =>
          setTransactionMessageLifetimeUsingBlockhash(latestBlockhash, tx),
        (tx) => appendTransactionMessageInstructions([registerInstruction], tx),
        (tx) => compileTransaction(tx)
      );

      const signedTxs = await signer.signTransactions([tx]);
      const signedTx = signedTxs[0];

      // Required to avoid "Transaction too large" errors. This checks the transaction size before sending.
      assertIsTransactionWithinSizeLimit(signedTx);
      const transactionSignature = getSignatureFromTransaction(signedTx);
      await sendAndConfirm(signedTx, {
        commitment: "confirmed",
      });

      toast.success("Usuario registrado exitosamente.");
      console.debug(
        `Inspect this transaction at ${getSolanaExplorerTx("/tx")}/${transactionSignature}`
      );
      setSuccess(true);
    } catch (error) {
      console.log("Error al registrar el usuario:", error);
      toast.error("Error al registrar el usuario.");
      setSuccess(false);
      setLoading(false);
    }
  };

  return {
    registerUser,
    loading,
    success,
  };
};
