"use client";

import { createClient } from "@solana/kit";
import { rpc, rpcAirdrop } from "@solana/kit-plugin-rpc";
import type { ReactNode } from "react";
import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import { getExplorerUrl } from "@/lib/getExplorerUrl";
import { CLUSTERS, DEFAULT_NETWORK, RPC_URL, WS_URL } from "@/shared/constants";
import type { ClusterNames } from "@/types";

const NETWORKS: Record<
  ClusterNames,
  { name: string; rpcUrl: string; wsUrl: string }
> = {
  mainnet: {
    name: "Solana Mainnet",
    rpcUrl: "https://api.mainnet-beta.solana.com",
    wsUrl: "wss://api.mainnet-beta.solana.com",
  },
  devnet: {
    name: "Solana Devnet",
    rpcUrl: "https://api.devnet.solana.com",
    wsUrl: "wss://api.devnet.solana.com",
  },
  testnet: {
    name: "Solana Testnet",
    rpcUrl: "https://api.testnet.solana.com",
    wsUrl: "wss://api.testnet.solana.com",
  },
  localnet: {
    name: "Solana Localnet",
    rpcUrl: "http://localhost:8899",
    wsUrl: "ws://localhost:8900",
  },
  custom: {
    name: "Custom Network",
    rpcUrl: RPC_URL,
    wsUrl: WS_URL,
  },
};

export function createSolanaClient(cluster: ClusterNames) {
  const network = NETWORKS[cluster];
  const rpcUrl = network.rpcUrl;
  const wsUrl = network.wsUrl;
  return createClient()
    .use(rpc(rpcUrl, { url: wsUrl }))
    .use(rpcAirdrop());
}

export type SolanaClient = ReturnType<typeof createSolanaClient>;

export type RpcType = Pick<SolanaClient, "rpc">;

export type NetworkContextType = {
  selectedCluster: ClusterNames;
  chooseCluster: (cluster: ClusterNames) => void;
  client: SolanaClient;
  explorerUrl: (path: string) => string;
};

export const NetworkContext = createContext<NetworkContextType>({
  selectedCluster: DEFAULT_NETWORK as ClusterNames,
  chooseCluster: () => {},
  client: createSolanaClient(DEFAULT_NETWORK as ClusterNames),
  explorerUrl: (path: string) =>
    getExplorerUrl(path, DEFAULT_NETWORK as ClusterNames),
});

export const NetworkContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [selectedCluster, setSelectedCluster] = useState<ClusterNames>(
    DEFAULT_NETWORK as ClusterNames,
  );

  const chooseCluster = useCallback((cluster: ClusterNames) => {
    setSelectedCluster(cluster);
    if (typeof window !== "undefined") {
      localStorage.setItem("selectedCluster", cluster);
    }
  }, []);

  const client = useMemo(
    () => createSolanaClient(selectedCluster),
    [selectedCluster],
  );

  const explorerUrl = useCallback(
    (path: string) => getExplorerUrl(path, selectedCluster),
    [selectedCluster],
  );

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedCluster = localStorage.getItem(
        "selectedCluster",
      ) as ClusterNames;
      if (savedCluster && CLUSTERS.includes(savedCluster)) {
        setSelectedCluster(savedCluster);
      }
    }
  }, []);

  return (
    <NetworkContext.Provider
      value={{
        selectedCluster,
        chooseCluster,
        client,
        explorerUrl,
      }}
    >
      {children}
    </NetworkContext.Provider>
  );
};
