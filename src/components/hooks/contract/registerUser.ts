"use client";
import {
  getInitializeUserProfileInstruction,
  findUserProfilePda,
  findIdentityPda,
  findReputationProfilePda,
  getInitializeUserProfileInstructionAsync,
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
  assertIsSendableTransaction,
} from "@solana/kit";
import { useState } from "react";
import { toast } from "sonner";
import { useCluster } from "../../cluster-context";
import { RegisterUserRes } from "@/src/types/hooks/useRegisterUser";

export const useRegisterUser = () => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const getSolanaExplorerTx = useCluster().getExplorerUrl;

  const registerUser = async ({
    props,
    id,
    doctype,
    countryCode,
  }: registerUserOnChain): Promise<RegisterUserRes> => {
    const { connected, ready, rpc, signer, wallet, sendAndConfirm } = props;

    if (!connected || !ready || !signer || !wallet) {
      throw new Error("Wallet not connected or ready");
    }
    const authorityAddr = address(wallet.address);

    try {
      setLoading(true);

      let authority = createNoopSigner(authorityAddr);

      let registerInstruction = await getInitializeUserProfileInstructionAsync({
        authority,
        countryCode,
        doctype,
        id,
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
      assertIsSendableTransaction(signedTx);

      const transactionSignature = getSignatureFromTransaction(signedTx);
      await sendAndConfirm(signedTx, {
        commitment: "confirmed",
      });
      console.debug(
        `Inspect this transaction at ${getSolanaExplorerTx("/tx")}/${transactionSignature}`
      );
      setSuccess(true);
      return {
        userProfile: registerInstruction.accounts[0].address,
        reputationProfile: registerInstruction.accounts[1].address,
        identity: registerInstruction.accounts[2].address,
      };
    } catch (error) {
      console.log("Failed to register user:", error);
      setSuccess(false);
      setLoading(false);
      throw new Error("Failed to register user");
    }
  };

  return {
    registerUser,
    loading,
    success,
  };
};
