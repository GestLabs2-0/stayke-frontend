import type { Address } from "@solana/kit";

// ─── Placeholder types for wallet integration ───────────────────────────────
// Replace with actual wallet library types when you pick a new provider.

export interface WalletUser {
  id: string;
  wallet?: {
    address: string;
  };
  email?: {
    address: string;
  };
  linkedAccounts?: Array<{
    type: string;
    chainType: string;
    address?: string;
  }>;
}

export interface SolanaWallet {
  address: string;
  signTransaction?: (params: {
    transaction: Uint8Array;
  }) => Promise<{ signedTransaction: Uint8Array }>;
}

export interface UsePrivyReturn {
  ready: boolean;
  authenticated: boolean;
  user: WalletUser | null;
  login: () => void;
  logout: () => Promise<void>;
  linkEmail: () => void;
}

export interface UseWalletsReturn {
  wallets: SolanaWallet[];
  ready: boolean;
}

// ─── wallet-standard types (used by signer.ts and standard.ts) ──────────────
// These are part of the wallet-standard / @solana/wallet-standard-features
// integration that was partially implemented.

export interface WalletConnectorMetadata {
  id: string;
  name: string;
  icon?: string;
}

export interface WalletAccount {
  address: Address;
  publicKey: Uint8Array;
  label?: string;
}

export interface WalletSession {
  account: WalletAccount;
  connector: WalletConnectorMetadata;
  disconnect: () => Promise<void>;
  signTransaction?: (
    transaction: Uint8Array,
    chain: string
  ) => Promise<Uint8Array>;
  sendTransaction?: (
    transaction: Uint8Array,
    chain: string
  ) => Promise<Uint8Array>;
}

export interface WalletConnector extends WalletConnectorMetadata {
  connect: (options?: { silent?: boolean }) => Promise<WalletSession>;
}
