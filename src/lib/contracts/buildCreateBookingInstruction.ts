import type { Address, Instruction } from "@solana/kit";
import { createNoopSigner } from "@solana/kit";
import {
  PublicKey,
  TransactionMessage,
  VersionedTransaction,
} from "@solana/web3.js";

import { findGlobalConfigPda } from "@GestLabs2-0/stayke-config";
import { findUserProfilePda } from "@GestLabs2-0/stayke-core";
import {
  findBookingPda,
  findEscrowTokenAccountPda,
  getCreateBookingCrossYearInstructionAsync,
  getCreateBookingInstructionAsync,
} from "@GestLabs2-0/stayke-escrow";
import type { SolanaClient } from "@/context/NetworkContext";
import { fromSolanaKitIns } from "@/helpers/web3Parsers";
import { USDC_MINT } from "@/lib/contracts/constants";
import type { CreateBookingTx } from "@/types/booking";
import { getYears, isCrossYear } from "./bookingDaysUtils";
import { findBookingDaysPda } from "./findBookingDaysPda";
import { associatedTokenAccount } from "./utils/deriveATA";

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

  const crossYear = isCrossYear(checkIn, checkOut);
  const { checkInYear, checkOutYear } = getYears(checkIn, checkOut);

  // Derive the escrow accounts required by createBooking.
  const [globalConfig] = await findGlobalConfigPda();
  const [booking] = await findBookingPda({ property, clientProfile, checkIn });
  const [bookingDays] = await findBookingDaysPda({
    property,
    year: checkInYear,
  });
  const [escrowTokenAccount] = await findEscrowTokenAccountPda({ booking });

  // Client's associated token account for the payment mint.
  const clientTokenAccount = associatedTokenAccount(wallet);

  let instruction: Instruction;

  if (crossYear) {
    const [bookingDaysNext] = await findBookingDaysPda({
      property,
      year: checkOutYear,
    });

    instruction = await getCreateBookingCrossYearInstructionAsync({
      payer: authority,
      client: authority,
      clientProfile,
      hostProfile,
      booking,
      property,
      globalConfig,
      bookingDays,
      bookingDaysNext,
      escrowTokenAccount,
      clientTokenAccount,
      mint,
      checkIn,
      checkOut,
    });
  } else {
    instruction = await getCreateBookingInstructionAsync({
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
  }
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
