"use client";

import React from "react";

/**
 * Placeholder provider — replace with actual wallet SDK provider.
 * Simply renders children with no wallet context for now.
 */
export function WalletProvider({ children }: { children: React.ReactNode }) {
  // TODO: wrap children with the actual wallet provider
  return <>{children}</>;
}
