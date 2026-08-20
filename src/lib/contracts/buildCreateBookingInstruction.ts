import type { Address } from "@solana/kit";
import { address, createNoopSigner } from "@solana/kit";
import {
  getAssociatedTokenAddressSync,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import {
  PublicKey,
  TransactionMessage,
  VersionedTransaction,
} from "@solana/web3.js";

import { findUserProfilePda } from "@GestLabs2-0/stayke-core";
import {
  findBookingDaysPda,
  findBookingPda,
  findEscrowConfigPda,
  findEscrowTokenAccountPda,
  getCreateBookingInstructionAsync,
} from "@GestLabs2-0/stayke-escrow";
import type { SolanaClient } from "@/context/NetworkContext";
import { fromSolanaKitIns } from "@/helpers/web3Parsers";
import { USDC_MINT } from "@/lib/contracts/constants";
import type { CreateBookingTx } from "@/types/booking";

export interface BuildCreateBookingTxParams {
  /** The guest's wallet, used both as payer and client signer. */
  wallet: Address;
  /** The host's authority (owner) wallet, used to derive the host profile. */
  hostWallet: Address;
  /** The on-chain listing/property PDA. */
  property: Address;
  /**
   * Payment token mint. Defaults to `USDC_MINT`; must match the deployed
   * stayke global config token mint.
   */
  mint?: Address;
  /** Unix timestamp (seconds) of the check-in day. */
  checkIn: number;
  /** Unix timestamp (seconds) of the check-out day. */
  checkOut: number;
  client: SolanaClient;
}

/**
 * Builds the `createBooking` instruction and wraps it into a versioned
 * transaction ready to be signed and sent by the wallet. Mirrors
 * `buildInitUserTx` and `buildInitPropertyTx`.
 */
export async function buildCreateBookingInstruction({
  wallet,
  hostWallet,
  property,
  mint = USDC_MINT,
  checkIn,
  checkOut,
  client,
}: BuildCreateBookingTxParams): Promise<CreateBookingTx> {
  const authority = createNoopSigner(wallet);

  // Derive the client (guest) and host user-profile PDAs.
  const [clientProfile] = await findUserProfilePda({ authority: wallet });
  const [hostProfile] = await findUserProfilePda({ authority: hostWallet });

  // Derive the escrow accounts required by createBooking.
  const [globalConfig] = await findEscrowConfigPda();
  const [booking] = await findBookingPda({ property, clientProfile, checkIn });
  const [bookingDays] = await findBookingDaysPda({ property, checkIn });
  const [escrowTokenAccount] = await findEscrowTokenAccountPda({ booking });

  // Client's associated token account for the payment mint.
  const clientTokenAccount = address(
    getAssociatedTokenAddressSync(
      new PublicKey(mint),
      new PublicKey(wallet),
      false,
      TOKEN_PROGRAM_ID,
    ).toBase58(),
  );

  const instruction = await getCreateBookingInstructionAsync({
    payer: authority,
    client: authority,
    clientProfile,
    hostProfile,
    booking,
    property,
    globalConfig,
    bookingDays,
    escrowTokenAccount,
    clientTokenAccount,
    mint,
    checkIn,
    checkOut,
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
    booking,
    bookingDays,
    escrowTokenAccount,
    tx,
  };
}
