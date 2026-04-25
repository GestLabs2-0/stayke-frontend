"use client";

import { useMemo } from "react";
import { useWallets } from "@privy-io/react-auth/solana";
import {
  type Address,
  FullySignedTransaction,
  getTransactionDecoder,
  getTransactionEncoder,
  sendAndConfirmTransactionFactory,
  Transaction,
  type TransactionWithBlockhashLifetime,
} from "@solana/kit";
import { useSolanaClient } from "@/src/lib/solanaClientContext";
import { SignStaykeTx } from "@/src/types/staykeWeb3";

export const useSignStaykeTx = (): SignStaykeTx => {
  const { wallets, ready } = useWallets();
  const solanaClient = useSolanaClient();
  const rpc = solanaClient.rpc;
  const sendAndConfirm = sendAndConfirmTransactionFactory({
    rpc,
    rpcSubscriptions: solanaClient.rpcSubscriptions,
  });

  const wallet = wallets?.[0];
  const signer = useMemo(() => {
    if (!ready || !wallet) return null;
    const encoder = getTransactionEncoder();
    const decoder = getTransactionDecoder();
    return {
      address: wallet.address as Address,

      async signTransactions<
        T extends Transaction & TransactionWithBlockhashLifetime,
      >(
        transactions: readonly T[]
      ): Promise<
        readonly (T &
          TransactionWithBlockhashLifetime &
          FullySignedTransaction)[]
      > {
        if (!wallet.signTransaction) {
          throw new Error("La wallet no admite firma de transacciones");
        }

        return Promise.all(
          transactions.map(async (tx) => {
            const wireBytes = new Uint8Array(encoder.encode(tx));

            const { signedTransaction } = await wallet.signTransaction({
              transaction: wireBytes,
            });

            const signedTx = decoder.decode(signedTransaction);

            return {
              ...signedTx,
              lifetimeConstraint: tx.lifetimeConstraint,
            } as T & FullySignedTransaction;
          })
        );
      },
    };
  }, [wallet, ready]);

  return {
    rpc,
    signer,
    wallet,
    sendAndConfirm,
    connected: ready && !!wallet,
    ready,
  };
};
