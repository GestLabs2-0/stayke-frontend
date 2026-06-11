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

  const fetchBalance = useCallback(async (isBackground: boolean= false) => {
    if (!addressString) return;
    if (isBackground)  setLoading(true);

    try {
      const pk = new PublicKey(addressString);

      const pdaTokenAcc = await getAssociatedTokenAddress(mintAddress, pk);

      const balanceMint = await client
        .getTokenAccountBalance(address(pdaTokenAcc.toString()))
        .send();

      const tokenBalance =
        Number(balanceMint.value.amount) / 10 ** balanceMint.value.decimals;

      setBalance(tokenBalance);
    } catch (error) {
      console.error("useSolBalance error:", error);
      setBalance(null);
    } finally {
      setLoading(false);
    }
  }, [addressString, client]);

  useEffect(() => {
    // Refresh every 30 seconds
    function runOnStart() {
      fetchBalance(true);
    }
    runOnStart()
    const interval = setInterval(fetchBalance, 30_000);
    return () => clearInterval(interval);
  }, [fetchBalance]);

  return { balance, isLoading, refresh: fetchBalance };
};
