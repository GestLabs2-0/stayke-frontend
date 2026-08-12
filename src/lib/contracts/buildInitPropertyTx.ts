import { createNoopSigner } from "@solana/kit";
import type { Address } from "@solana/kit";
import { PublicKey, TransactionMessage, VersionedTransaction } from "@solana/web3.js";

import { getInitializeListingInstructionAsync } from "@GestLabs2-0/stayke-core";
import type { SolanaClient } from "@/context/NetworkContext";
import { fromSolanaKitIns } from "@/helpers/web3Parsers";

export interface BuildInitPropertyTxParams {
  /** The user's wallet, used both as payer and authority signer. */
  wallet: Address;
  /** The on-chain UserProfile PDA (seeded by the user's authority). */
  userProfile: Address;
  /** The listing id (u16), equal to userProfile.listings before increment. */
  listingId: number;
  /** Price per night in whole units (u64). */
  price: number;
  /** 32-byte sha256 of the canonical listing data (backend hashedValue). */
  stateHash: Uint8Array;
  /** 32-byte content reference (Arweave/IPFS/backend URL), placeholder for now. */
  contentRef: Uint8Array;
  client: SolanaClient;
}

/**
 * Builds the `initializeListing` instruction and wraps it into a
 * versioned transaction ready to be signed and sent by the wallet.
 */
export async function buildInitPropertyTx({
  wallet,
  userProfile,
  listingId,
  price,
  stateHash,
  contentRef,
  client,
}: BuildInitPropertyTxParams) {
  const authority = createNoopSigner(wallet);

  const instruction = await getInitializeListingInstructionAsync({
    payer: authority,
    authority,
    userProfile,
    listingId,
    price: BigInt(Math.round(price)),
    stateHash,
    contentRef,
  });

  const web3Instruction = fromSolanaKitIns(instruction);

  const { value: latestBlockhash } = await client.rpc
    .getLatestBlockhash()
    .send();

  const tx = new VersionedTransaction(
    new TransactionMessage({
      instructions: [web3Instruction],
      payerKey: new PublicKey(wallet),
      recentBlockhash: latestBlockhash.blockhash,
    }).compileToV0Message(),
  );

  return {
    // accounts: [payer, authority, listing, userProfile, systemProgram]
    listing: instruction.accounts[2].address,
    tx,
  };
}
