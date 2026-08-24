export type ClusterNames = "mainnet" | "devnet" | "testnet" | "localnet";

export type NetworkConfig = {
  name: string;
  rpcUrl: string;
  wsUrl: string;
  networkId: string;
};
