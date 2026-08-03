export type ClusterNames = "mainnet" | "devnet" | "testnet" | "custom";

export type NetworkConfig = {
  name: string;
  rpcUrl: string;
  wsUrl: string;
  networkId: string;
};
