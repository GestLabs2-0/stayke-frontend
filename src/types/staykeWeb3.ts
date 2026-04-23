import { ConnectedStandardSolanaWallet } from "@privy-io/react-auth/solana";
import {
  Address,
  FullySignedTransaction,
  sendAndConfirmTransactionFactory,
  Transaction,
} from "@solana/kit";
import { RpcType } from "../lib/solanaClient";
import { DocType } from "../generated/stayke_core";

export interface SignStaykeTx extends RpcType {
  signer: {
    address: Address;
    signTransactions<T extends Transaction>(
      transactions: readonly T[]
    ): Promise<readonly (T & FullySignedTransaction)[]>;
  } | null;
  wallet: ConnectedStandardSolanaWallet;
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
