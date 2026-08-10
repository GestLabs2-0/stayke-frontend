"use client";

import type { NetworkData } from "@dynamic-labs-sdk/client";
import { createDynamicClient } from "@dynamic-labs-sdk/client";
import { DynamicProvider } from "@dynamic-labs-sdk/react-hooks";
import {
  addPhantomRedirectSolanaExtension,
  addSolanaExtension,
} from "@dynamic-labs-sdk/solana";
import { addWaasSolanaExtension } from "@dynamic-labs-sdk/solana/waas";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import {
  API_URL,
  DYNAMIC_CLIENT_ID,
  ENVIRONMENT,
  FRONTEND_URL,
} from "@/shared/constants";
import { RPC_URL } from "../shared/constants";

export const client = createDynamicClient({
  // biome-ignore  lint/style/noNonNullAssertion: already checked
  environmentId: DYNAMIC_CLIENT_ID!,
  coreConfig: {
    ...(ENVIRONMENT === "production" && { apiBaseUrl: `${API_URL}/api/v0` }),
  },
  transformers: {
    networksData: (networks) => [
      ...networks,
      {
        blockExplorerUrls: ["https://explorer.solana.com"],
        chain: "SOL",
        displayName: "LocalNet",
        cluster: "custom",
        iconUrl:
          "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png",
        name: "Local Network",
        networkId: "solana-custom",
        rpcUrls: {
          http: [RPC_URL],
        },
        nativeCurrency: {
          decimals: 9,
          name: "SOL",
          symbol: "SOL",
        },
        testnet: true,
      } satisfies NetworkData,
    ],
  },
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
