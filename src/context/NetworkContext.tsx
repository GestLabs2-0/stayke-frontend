"use client";

import { createClient } from "@solana/kit";
import { rpc, rpcAirdrop } from "@solana/kit-plugin-rpc";
import type { ReactNode } from "react";
import { createContext, useMemo } from "react";

import { getExplorerUrl } from "@/lib/getExplorerUrl";
import { DEFAULT_NETWORK, RPC_URL, WS_URL } from "@/shared/constants";
import type { ClusterNames } from "@/types";

export function createSolanaClient() {
  return createClient()
    .use(rpc(RPC_URL, { url: WS_URL }))
    .use(rpcAirdrop());
}

export type SolanaClient = ReturnType<typeof createSolanaClient>;

export type RpcType = Pick<SolanaClient, "rpc">;

export type NetworkContextType = {
  selectedCluster: ClusterNames;
  client: SolanaClient;
  explorerUrl: (path: string) => string;
};

export const NetworkContext = createContext<NetworkContextType>({
  selectedCluster: DEFAULT_NETWORK as ClusterNames,
  client: createSolanaClient(),
  explorerUrl: (path: string) =>
    getExplorerUrl(path, DEFAULT_NETWORK as ClusterNames),
});

export const NetworkContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  // Un solo cliente, creado una vez. Sin re-renders por cambio de red.
  const client = useMemo(() => createSolanaClient(), []);

  const explorerUrl = (path: string) =>
    getExplorerUrl(path, DEFAULT_NETWORK as ClusterNames);

  return (
    <NetworkContext.Provider
      value={{
        selectedCluster: DEFAULT_NETWORK as ClusterNames,
        client,
        explorerUrl,
      }}
    >
      {children}
    </NetworkContext.Provider>
  );
};
