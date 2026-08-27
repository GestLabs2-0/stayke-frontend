import type { VersionedTransaction } from "@solana/web3.js";

export function needsMoreSignatures(tx: VersionedTransaction): boolean {
  return tx.signatures.some((sig) => sig.every((byte) => byte === 0));
}
