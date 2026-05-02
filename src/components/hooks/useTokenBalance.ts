"use client";

import { useEffect, useState, useCallback } from "react";

import { address } from "@solana/kit";

import { useSolanaClient } from "@/src/lib/solanaClientContext";

import { getAssociatedTokenAddress } from "@solana/spl-token";
import { MINT_ADDRESS } from "@/src/constant";
import { PublicKey } from "@solana/web3.js";
const mintAddress = new PublicKey(MINT_ADDRESS);
/**
 * Hook to get the SOL balance of an address using Solana Kit v2 RPC.
 */
export const useTokenBalance = (addressString: string | null) => {
  const [balance, setBalance] = useState<number | null>(null);
  const [isLoading, setLoading] = useState(false);

  const client = useSolanaClient().rpc;

  const fetchBalance = useCallback(async () => {
    if (!addressString) return;
    setLoading(true);

    try {
      let pk = new PublicKey(addressString);

      let pdaTokenAcc = await getAssociatedTokenAddress(mintAddress, pk);

      let balanceMint = await client
        .getTokenAccountBalance(address(pdaTokenAcc.toString()))
        .send();

      let tokenBalance =
        Number(balanceMint.value.amount) / 10 ** balanceMint.value.decimals;

      setBalance(tokenBalance);
    } catch (error) {
      console.error("useSolBalance error:", error);
      setBalance(null);
    } finally {
      setLoading(false);
    }
  }, [addressString]);

  useEffect(() => {
    fetchBalance();

    // Refresh every 30 seconds
    const interval = setInterval(fetchBalance, 30_000);
    return () => clearInterval(interval);
  }, [fetchBalance]);

  return { balance, isLoading, refresh: fetchBalance };
};
