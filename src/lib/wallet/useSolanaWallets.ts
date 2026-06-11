"use client";

import type { UseWalletsReturn } from "./types";

/**
 * Placeholder hook — replace with actual wallet SDK hook.
 * Mimics the Privy `useWallets()` interface so existing code doesn't break.
 */
export function useWallets(): UseWalletsReturn {
  // TODO: implement Solana wallet detection
  return {
    wallets: [],
    ready: false,
  };
}
