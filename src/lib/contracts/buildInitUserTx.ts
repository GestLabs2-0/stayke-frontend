import type { Address } from "@solana/kit";
import {
  appendTransactionMessageInstructions,
  assertIsTransactionWithinSizeLimit,
  compileTransaction,
  createNoopSigner,
  createTransactionMessage,
  pipe,
  setTransactionMessageFeePayerSigner,
  setTransactionMessageLifetimeUsingBlockhash,
} from "@solana/kit";

import { getInitializeUserProfileInstructionAsync } from "@GestLabs2-0/stayke-core";
import type { SolanaClient } from "@/context/NetworkContext";

export async function buildInitUserTx(addr: Address, client: SolanaClient) {
  const authority = createNoopSigner(addr);

  const instruction = await getInitializeUserProfileInstructionAsync({
    authority: authority,
    // TODO: in the future we will use a backend relayer
    payer: authority,
  });

  const { value: latestBlockhash } = await client.rpc
    .getLatestBlockhash()
    .send();
  const tx = pipe(
    createTransactionMessage({ version: 0 }),
    (tx) => setTransactionMessageFeePayerSigner(authority, tx),
    (tx) => setTransactionMessageLifetimeUsingBlockhash(latestBlockhash, tx),
    (tx) => appendTransactionMessageInstructions([instruction], tx),
    (tx) => compileTransaction(tx),
  );

  // Required to avoid "Transaction too large" errors. This checks the transaction size before sending.
  assertIsTransactionWithinSizeLimit(tx);

  return {
    userProfile: instruction.accounts[2].address,
    reputationProfile: instruction.accounts[3].address,
    tx: tx,
  };
}
