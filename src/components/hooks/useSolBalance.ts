"use client";

import { useEffect, useState, useCallback } from "react";

import { address } from "@solana/kit";

import { useSolanaClient } from "@/src/lib/solanaClientContext";

/**
 * Hook to get the SOL balance of an address using Solana Kit v2 RPC.
 */
export const useSolBalance = (addressString: string) => {
  const [balance, setBalance] = useState<number | null>(null);
  const [isLoading, setLoading] = useState(false);
  const client = useSolanaClient().rpc;

  const fetchBalance = useCallback(
    async (isBackground: boolean = false) => {
      if (!addressString) return;
      if (isBackground) setLoading(true);
      try {
        const res = await client.getBalance(address(addressString)).send();
        // Balance is in lamports → divide by 1_000_000_000 for SOL
        const sol = Number(res.value) / 1_000_000_000;
        setBalance(sol);
      } catch (error) {
        console.error("useSolBalance error:", error);
        setBalance(null);
      } finally {
        setLoading(false);
      }
    },
    [addressString, client]
  );

  useEffect(() => {
    function runOnStart() {
      fetchBalance(true);
    }
    runOnStart();

    // Refresh every 30 seconds
    const interval = setInterval(fetchBalance, 30_000);
    return () => clearInterval(interval);
  }, [fetchBalance]);

  return { balance, isLoading, refresh: fetchBalance };
};
