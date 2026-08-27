import { address } from "@solana/kit";

import type { ClusterNames } from "@/types";

export const CLUSTERS: ClusterNames[] = [
  "mainnet",
  "devnet",
  "testnet",
  "localnet",
];

export const ENVIRONMENT = process.env.NODE_ENV;

export const RPC_URL =
  process.env.NEXT_PUBLIC_RPC_URL || "http://localhost:8899";
export const WS_URL =
  process.env.NEXT_PUBLIC_WS_URL || RPC_URL.replace(/^http/, "ws");
export const GENESIS_HASH = process.env.NEXT_PUBLIC_SOLANA_GENESIS_HASH;
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

/** networkId que Dynamic espera según el cluster */
export const DYNAMIC_NETWORK_ID: Record<ClusterNames, string> = {
  mainnet: "mainnet-beta",
  devnet: "devnet",
  testnet: "testnet",
  localnet: "localnet",
};

export const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api/v1.0";

/**
 * Base URL pública para las imágenes de propiedades. El backend entrega un
 * `imageKey` por reserva; la URL final se arma concatenando el imageKey a
 * esta base (NEXT_PUBLIC_PROPERTY_IMAGE_URL).
 */
export const PROPERTY_IMAGE_BASE_URL =
  process.env.NEXT_PUBLIC_PROPERTY_IMAGE_URL ||
  "https://pub-7dc2fed328d54420a60e3b6445a9d766.r2.dev";

export const JWT_DURATION = Number(
  process.env.NEXT_PUBLIC_JWT_DURATION ?? "86400",
);

export const FRONTEND_URL = process.env.NEXT_PUBLIC_FRONTEND_URL;

if (!FRONTEND_URL) {
  throw new Error("FRONTEND_URL unknown");
}
export const DYNAMIC_CLIENT_ID = process.env.NEXT_PUBLIC_DYNAMIC_CLIENT_ID;

if (!DYNAMIC_CLIENT_ID) {
  throw new Error("DYNAMIC_CLIENT_ID unknown");
}

export const LOCAL_STORAGE_KEYS = {
  accessToken: "acc_token_stayke",
  refreshToken: "rf_token_stayke",
  dynamicSession: `dynamic_${DYNAMIC_CLIENT_ID}_session`,
};

export const IS_MVP =
  process.env.NEXT_PUBLIC_MVP === "true" || process.env.NEXT_PUBLIC_MVP === "1";

export const MINT_DECIMALS = Number.isNaN(
  Number(process.env.NEXT_PUBLIC_MINT_DECIMALS),
)
  ? 6
  : Number(process.env.NEXT_PUBLIC_MINT_DECIMALS);

export const FEE_PAYER = address(process.env.NEXT_PUBLIC_FEE_PAYER ?? "");

export const RELAYER_URL =
  process.env.NEXT_PUBLIC_RELAYER_URL || "http://localhost:3002/api/v1.0";
