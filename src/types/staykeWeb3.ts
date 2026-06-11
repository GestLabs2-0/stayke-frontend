import type { SolanaWallet } from "@/src/lib/wallet";
import {
  Address,
  FullySignedTransaction,
  sendAndConfirmTransactionFactory,
  Transaction,
  TransactionWithBlockhashLifetime,
} from "@solana/kit";
import { RpcType } from "../lib/solanaClient";
import { DocType } from "@GestLabs2-0/stayke-core";

export interface SignStaykeTx extends RpcType {
  signer: {
    address: Address;
    signTransactions<T extends Transaction & TransactionWithBlockhashLifetime>(
      transactions: readonly T[]
    ): Promise<
      readonly (T & TransactionWithBlockhashLifetime & FullySignedTransaction)[]
    >;
  } | null;
  wallet: SolanaWallet;
  sendAndConfirm: ReturnType<typeof sendAndConfirmTransactionFactory>;
  connected: boolean;
  ready: boolean;
}

export interface registerUserOnChain {
  props: SignStaykeTx;
  id: Uint8Array;
  doctype: DocType;
  countryCode: Uint8Array;
}

export interface registerPropertyOnChain {
  props: SignStaykeTx;
  price: number;
  userProfilePda: string;
  listingCount: number;
}
