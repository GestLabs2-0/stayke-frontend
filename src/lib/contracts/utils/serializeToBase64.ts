import type { Transaction, VersionedTransaction } from "@solana/web3.js";

export function serializeToBase64(tx: VersionedTransaction | Transaction) {
  return Buffer.from(tx.serialize()).toString("base64");
}
