"use client";

import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";
import { ClusterProvider } from "../cluster-context";
import { SolanaClientProvider } from "../../lib/solanaClientContext";
import { UserContextProvider } from "./UserContext";
import { AuthGate } from "../shared/AuthGate";

import { PrivyProvider } from "@privy-io/react-auth";
import { toSolanaWalletConnectors } from "@privy-io/react-auth/solana";
import { createSolanaRpc, createSolanaRpcSubscriptions } from "@solana/kit";
import { PRIVY_APP_ID } from "../../constant";

const solanaConnectors = toSolanaWalletConnectors({
  // By default, shouldAutoConnect is enabled
  shouldAutoConnect: true,
});

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class">
      <PrivyProvider
        appId={PRIVY_APP_ID!}
        config={{
          solana: {
            rpcs: {
              "solana:mainnet": {
                rpc: createSolanaRpc("https://api.mainnet-beta.solana.com"),
                rpcSubscriptions: createSolanaRpcSubscriptions(
                  "wss://api.mainnet-beta.solana.com"
                ),
              },
              "solana:devnet": {
                rpc: createSolanaRpc("https://api.devnet.solana.com"),
                rpcSubscriptions: createSolanaRpcSubscriptions(
                  "wss://api.devnet.solana.com"
                ),
              },
              "solana:testnet": {
                rpc: createSolanaRpc("https://api.testnet.solana.com"),
                rpcSubscriptions: createSolanaRpcSubscriptions(
                  "wss://api.testnet.solana.com"
                ),
              },
              "solana:localnet": {
                rpc: createSolanaRpc("http://localhost:8899"),
                rpcSubscriptions: createSolanaRpcSubscriptions(
                  "ws://localhost:8899"
                ),
              },
            },
          },
          appearance: {
            showWalletLoginFirst: true,
            walletChainType: "solana-only",
            walletList: ["detected_solana_wallets", "phantom", "solflare"],
            theme: "dark",
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
          <SolanaClientProvider>
            <UserContextProvider>
              <AuthGate>{children}</AuthGate>
            </UserContextProvider>
          </SolanaClientProvider>
        </ClusterProvider>
      </PrivyProvider>
      <Toaster position="bottom-right" richColors />
    </ThemeProvider>
  );
}
