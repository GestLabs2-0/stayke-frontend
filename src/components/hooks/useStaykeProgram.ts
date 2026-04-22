"use client";

import { useMemo } from "react";
import { useWallets } from "@privy-io/react-auth/solana";
import { type TransactionModifyingSigner, type Address } from "@solana/kit";
import { STAYKE_CORE_PROGRAM_ADDRESS } from "../../generated/stayke_core";
import { useSolanaClient } from "@/src/lib/solanaClientContext";

export const useStaykeProgram = () => {
  const { wallets, ready } = useWallets();
  const rpc = useSolanaClient().rpc;

  const wallet = wallets?.[0];

  const signer: TransactionModifyingSigner | undefined = useMemo(() => {
    if (!ready || !wallet) return undefined;

    return {
      address: wallet.address as Address,

      async modifyAndSignTransactions(transactions) {
        try {
          if (!wallet.signTransaction) {
            throw new Error("La wallet no admite firma de transacciones");
          }

          type WalletTx = Parameters<
            NonNullable<typeof wallet.signTransaction>
          >[0];

          const signedTxs = await Promise.all(
            transactions.map(async (tx) => {
              return await wallet.signTransaction!(tx as unknown as WalletTx);
            })
          );
          type ExpectedReturnType = Awaited<
            ReturnType<TransactionModifyingSigner["modifyAndSignTransactions"]>
          >;
          return signedTxs as unknown as ExpectedReturnType;
        } catch (error) {
          console.error("Error firmando transacciones:", error);
          throw error;
        }
      },
    };
  }, [wallet, ready]);

  return {
    rpc,
    signer,
    wallet,
    programId: STAYKE_CORE_PROGRAM_ADDRESS,
    connected: ready && !!wallet,
    ready,
  };
};
