"use client";

// import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";
import { ClusterProvider } from "../cluster-context";
import { SolanaClientProvider } from "../../lib/solanaClientContext";
import { UserContextProvider } from "./UserContext";
import { AuthGate } from "../shared/AuthGate";

import { WalletProvider } from "@/src/lib/wallet";
import React from "react";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    // <ThemeProvider attribute="class">
    <React.Fragment>
      <WalletProvider>
        <ClusterProvider>
          <SolanaClientProvider>
            <UserContextProvider>
              <AuthGate>{children}</AuthGate>
            </UserContextProvider>
          </SolanaClientProvider>
        </ClusterProvider>
      </WalletProvider>
      <Toaster position="bottom-right" richColors />
      {/* </ThemeProvider> */}
    </React.Fragment>
  );
}
