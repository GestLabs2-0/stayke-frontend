"use client";

import { createDynamicClient } from "@dynamic-labs-sdk/client";
import { DynamicProvider } from "@dynamic-labs-sdk/react-hooks";
import {
  addPhantomRedirectSolanaExtension,
  addSolanaExtension,
} from "@dynamic-labs-sdk/solana";
import { addWaasSolanaExtension } from "@dynamic-labs-sdk/solana/waas";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { DYNAMIC_CLIENT_ID, FRONTEND_URL } from "@/shared/constants";

export const client = createDynamicClient({
  // biome-ignore  lint/style/noNonNullAssertion: already checked
  environmentId: DYNAMIC_CLIENT_ID!,
  metadata: {
    name: "Stayke",
    // biome-ignore  lint/style/noNonNullAssertion: already checked
    universalLink: FRONTEND_URL!,
  },
});

// Register chain extensions at module level
addSolanaExtension();
addPhantomRedirectSolanaExtension({
  onCloseTab: () => {
    window.close();
  },
  // biome-ignore  lint/style/noNonNullAssertion: already checked
  url: new URL(FRONTEND_URL!),
});
addWaasSolanaExtension();

const queryClient = new QueryClient();

export function EmbeddedProvider({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <DynamicProvider client={client}>{children}</DynamicProvider>
    </QueryClientProvider>
  );
}
