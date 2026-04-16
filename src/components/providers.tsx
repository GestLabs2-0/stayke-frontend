"use client";

import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";
import { ClusterProvider } from "./cluster-context";
import { SolanaClientProvider } from "../lib/solana-client-context";

import { PrivyProvider } from "@privy-io/react-auth";
import { toSolanaWalletConnectors } from "@privy-io/react-auth/solana";
import { createSolanaRpc, createSolanaRpcSubscriptions } from "@solana/kit";

const solanaConnectors = toSolanaWalletConnectors({
  // By default, shouldAutoConnect is enabled
  shouldAutoConnect: true,
});

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark">
      <PrivyProvider
        appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID!}
        config={{
          solana: {
            rpcs: {
              "solana:mainnet": {
                rpc: createSolanaRpc("https://api.mainnet-beta.solana.com"),
                rpcSubscriptions: createSolanaRpcSubscriptions(
                  "wss://api.mainnet-beta.solana.com"
                ),
              },
            },
          },
          appearance: {
            showWalletLoginFirst: true,
            walletChainType: "solana-only",
          },
          loginMethods: ["wallet", "email"],
          externalWallets: {
            solana: {
              connectors: solanaConnectors,
            },
          },
          embeddedWallets: {
            solana: { createOnLogin: "users-without-wallets" },
          },
        }}
      >
        <ClusterProvider>
          <SolanaClientProvider>{children}</SolanaClientProvider>
          <Toaster position="bottom-right" richColors />
        </ClusterProvider>
      </PrivyProvider>
    </ThemeProvider>
  );
}
