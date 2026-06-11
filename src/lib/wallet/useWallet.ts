"use client";

import type { UsePrivyReturn } from "./types";

/**
 * Placeholder hook — replace with actual wallet SDK hook.
 * Mimics the Privy `usePrivy()` interface so existing code doesn't break.
 */
export function usePrivy(): UsePrivyReturn {
  // TODO: implement wallet connection logic
  return {
    ready: false,
    authenticated: false,
    user: null,
    login: () => {
      console.warn("Wallet login not implemented");
    },
    logout: async () => {
      console.warn("Wallet logout not implemented");
    },
    linkEmail: () => {
      console.warn("linkEmail not implemented");
    },
  };
}
