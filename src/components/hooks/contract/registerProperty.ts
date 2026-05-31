"use client";
import { getInitializeListingInstructionAsync } from "@GestLabs2-0/stayke-core";
import type { registerPropertyOnChain } from "@/src/types/staykeWeb3";
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
import { useCluster } from "../../cluster-context";
import { CreatePropertyOnChainRes } from "@/src/types/hooks/contractCalls";

export const useRegisterProperty = () => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const getSolanaExplorerTx = useCluster().getExplorerUrl;

  const registerProperty = async ({
    props,
    listingCount,
    price,
    userProfilePda,
  }: registerPropertyOnChain): Promise<CreatePropertyOnChainRes> => {
    const { connected, ready, rpc, signer, wallet, sendAndConfirm } = props;

    if (!connected || !ready || !signer || !wallet) {
      throw new Error("Wallet not connected or ready");
    }
    const authorityAddr = address(wallet.address);

    try {
      setLoading(true);

      let authority = createNoopSigner(authorityAddr);

      let createPropertyInst = await getInitializeListingInstructionAsync({
        authority,
        userProfile: address(userProfilePda),
        listingId: listingCount,
        price,
      });
      const { value: latestBlockhash } = await rpc.getLatestBlockhash().send();
      const tx = pipe(
        createTransactionMessage({ version: 0 }),
        (tx) => setTransactionMessageFeePayerSigner(authority, tx),
        (tx) =>
          setTransactionMessageLifetimeUsingBlockhash(latestBlockhash, tx),
        (tx) => appendTransactionMessageInstructions([createPropertyInst], tx),
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
        propertyAddr: createPropertyInst.accounts[0].address,
      };
    } catch (error) {
      console.log("Failed to register user:", error);
      setSuccess(false);
      setLoading(false);
      throw new Error("Failed to register user");
    }
  };

  return {
    registerProperty,
    loading,
    success,
  };
};
