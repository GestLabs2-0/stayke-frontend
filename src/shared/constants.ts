import type { ClusterNames } from "@/types";

export const CLUSTERS: ClusterNames[] = [
  "mainnet",
  "devnet",
  "testnet",
  "localnet",
  "custom",
];

export const ENVIRONMENT = process.env.NODE_ENV;

export const NETWORK_SELECTOR = process.env.NEXT_PUBLIC_NETWORK_SELECTOR
  ? Boolean(process.env.NEXT_PUBLIC_NETWORK_SELECTOR)
  : false;

export const RPC_URL =
  process.env.NEXT_PUBLIC_RPC_URL || "http://localhost:8899";
export const WS_URL = process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:8900";
export const COMMITMENT = process.env.NEXT_PUBLIC_COMMITMENT || "confirmed";
export const DEFAULT_NETWORK =
  process.env.NEXT_PUBLIC_DEFAULT_NETWORK || "devnet";

if (CLUSTERS.indexOf(DEFAULT_NETWORK as ClusterNames) === -1) {
  throw new Error(
    `Invalid default network: ${DEFAULT_NETWORK}. Must be one of: ${CLUSTERS.join(
      ", ",
    )}`,
  );
}
