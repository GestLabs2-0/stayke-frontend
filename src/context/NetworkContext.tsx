"use client";

import {
  getNetworksData,
  getWalletAccounts,
  waitForClientInitialized,
} from "@dynamic-labs-sdk/client";
import { useSwitchActiveNetwork } from "@dynamic-labs-sdk/react-hooks";
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
import type { ClusterNames, NetworkConfig } from "@/types";

const DEFAULT_NETWORKS: Record<ClusterNames, NetworkConfig> = {
  mainnet: {
    name: "Solana Mainnet",
    rpcUrl: "https://api.mainnet-beta.solana.com",
    wsUrl: "wss://api.mainnet-beta.solana.com",
    networkId: "mainnet-beta",
  },
  devnet: {
    name: "Solana Devnet",
    rpcUrl: "https://api.devnet.solana.com",
    wsUrl: "wss://api.devnet.solana.com",
    networkId: "devnet",
  },
  testnet: {
    name: "Solana Testnet",
    rpcUrl: "https://api.testnet.solana.com",
    wsUrl: "wss://api.testnet.solana.com",
    networkId: "testnet",
  },

  custom: {
    name: "Solana Custom",
    rpcUrl: RPC_URL,
    wsUrl: WS_URL,
    networkId: "solana-custom",
  },
};

function wsFromRpcUrl(rpcUrl: string): string {
  return rpcUrl.replace(/^http/, "ws");
}

function networksFromDynamic(): Partial<Record<ClusterNames, NetworkConfig>> {
  const dynamicNetworks = getNetworksData();
  const result: Partial<Record<ClusterNames, NetworkConfig>> = {};
  for (const network of dynamicNetworks) {
    if (
      network.chain !== "SOL" ||
      !network.cluster ||
      network.rpcUrls.http.length === 0
    ) {
      continue;
    }
    const rpcUrl = network.rpcUrls.http[0];
    result[network.cluster as ClusterNames] = {
      name: network.displayName,
      rpcUrl,
      wsUrl: wsFromRpcUrl(rpcUrl),
      networkId: network.networkId,
    };
  }
  return result;
}

export function createSolanaClient(
  cluster: ClusterNames,
  networks: Record<ClusterNames, NetworkConfig> = DEFAULT_NETWORKS,
) {
  const network = networks[cluster];
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
  const wallets = getWalletAccounts();
  const { mutate: changeNetwork } = useSwitchActiveNetwork();
  const [selectedCluster, setSelectedCluster] = useState<ClusterNames>(
    DEFAULT_NETWORK as ClusterNames,
  );
  const [networks, setNetworks] =
    useState<Record<ClusterNames, NetworkConfig>>(DEFAULT_NETWORKS);

  const chooseCluster = useCallback(
    (cluster: ClusterNames) => {
      setSelectedCluster(cluster);
      if (wallets.length > 0 && networks[cluster]) {
        changeNetwork({
          walletAccount: wallets[0],
          networkId: networks[cluster].networkId,
        });
      }
      if (typeof window !== "undefined") {
        localStorage.setItem("selectedCluster", cluster);
      }
    },
    [wallets, changeNetwork, networks],
  );

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        await waitForClientInitialized();
        if (cancelled) return;
        setNetworks((prev) => ({ ...prev, ...networksFromDynamic() }));
      } catch {
        // Dynamic not ready — keep defaults
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const client = useMemo(
    () => createSolanaClient(selectedCluster, networks),
    [selectedCluster, networks],
  );

  const explorerUrl = useCallback(
    (path: string) =>
      getExplorerUrl(path, selectedCluster, networks[selectedCluster]?.rpcUrl),
    [selectedCluster, networks],
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
