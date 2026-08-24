import type { Address, Instruction } from "@solana/kit";
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

import {
  findGlobalConfigPda,
  findPlatformVaultPda,
} from "@GestLabs2-0/stayke-config";
import {
  fetchMaybeUserProfile,
  STAYKE_CORE_PROGRAM_ADDRESS,
} from "@GestLabs2-0/stayke-core";
import {
  findCpiAuthorityPda,
  findEscrowTokenAccountPda,
  getBookingCompletesInstruction,
  getBookingStartsInstructionAsync,
  getExpireBookingCrossYearInstructionAsync,
  getExpireBookingInstructionAsync,
  getHostAcceptBookingInstructionAsync,
  getHostCancelBookingCrossYearInstructionAsync,
  getHostCancelBookingInstructionAsync,
  getHostRejectBookingCrossYearInstructionAsync,
  getHostRejectBookingInstructionAsync,
  getReleaseFundsInstructionAsync,
} from "@GestLabs2-0/stayke-escrow";
import {
  findConfigPda as findTreasuryConfigPda,
  findTreasuryPdaPda,
  findTreasuryVaultPda,
  STAYKE_TREASURY_PROGRAM_ADDRESS,
} from "@GestLabs2-0/stayke-treasury";
import type { SolanaClient } from "@/context/NetworkContext";
import { fromSolanaKitIns } from "@/helpers/web3Parsers";
import { USDC_MINT } from "@/lib/contracts/constants";
import type { Booking } from "@/types/api/booking";
import type { HostBookingAction } from "@/types/profile/bookings";
import { getYears, isCrossYear } from "./bookingDaysUtils";
import { findBookingDaysPda } from "./findBookingDaysPda";

export type { HostBookingAction };

export interface BuildHostBookingActionParams {
  action: HostBookingAction;
  /** The host's wallet (payer + host/caller signer). */
  wallet: Address;
  booking: Booking;
  client: SolanaClient;
}

export interface BuiltHostBookingTx {
  booking: Address;
  tx: VersionedTransaction;
}

const TOKEN_PROGRAM: Address = address(TOKEN_PROGRAM_ID.toBase58());

function associatedTokenAccount(owner: Address): Address {
  return address(
    getAssociatedTokenAddressSync(
      new PublicKey(USDC_MINT),
      new PublicKey(owner),
      false,
      TOKEN_PROGRAM_ID,
    ).toBase58(),
  );
}

async function profileAuthority(
  client: SolanaClient,
  profile: Address,
): Promise<Address> {
  const account = await fetchMaybeUserProfile(client.rpc, profile);
  return account.exists ? account.data.authority : profile;
}

/**
 * Builds the on-chain host action for a booking and wraps it into a versioned
 * transaction ready to be signed and sent by the host's wallet. Mirrors
 * `buildCreateBookingInstruction` (same escrow config, mint and tx wrapper).
 */
export async function buildHostBookingAction({
  action,
  wallet,
  booking,
  client,
}: BuildHostBookingActionParams): Promise<BuiltHostBookingTx> {
  const signer = createNoopSigner(wallet);
  const bookingPda = address(booking.idPda);
  const property = address(booking.property.pda);
  const hostProfile = address(booking.host.userProfile);
  const guestProfile = address(booking.guest.userProfile);
  const crossYear = isCrossYear(booking.checkIn, booking.checkOut);
  const { checkInYear, checkOutYear } = getYears(
    booking.checkIn,
    booking.checkOut,
  );

  const [globalConfig] = await findGlobalConfigPda();
  const [bookingDays] = await findBookingDaysPda({
    property,
    year: checkInYear,
  });
  const [escrowTokenAccount] = await findEscrowTokenAccountPda({
    booking: bookingPda,
  });

  let instruction: Instruction;

  switch (action) {
    case "accept": {
      instruction = await getHostAcceptBookingInstructionAsync({
        payer: signer,
        host: signer,
        hostProfile,
        booking: bookingPda,
        globalConfig,
      });
      break;
    }

    case "reject": {
      const guestWallet = await profileAuthority(client, guestProfile);
      const guestTokenAccount = associatedTokenAccount(guestWallet);
      const base = {
        payer: signer,
        host: signer,
        hostProfile,
        guest: guestProfile,
        booking: bookingPda,
        globalConfig,
        escrowTokenAccount,
        guestTokenAccount,
        mint: USDC_MINT,
        tokenProgram: TOKEN_PROGRAM,
      };
      if (crossYear) {
        const [bookingDaysNext] = await findBookingDaysPda({
          property,
          year: checkOutYear,
        });
        instruction = await getHostRejectBookingCrossYearInstructionAsync({
          ...base,
          bookingDays,
          bookingDaysNext,
        });
      } else {
        instruction = await getHostRejectBookingInstructionAsync({
          ...base,
          bookingDays,
        });
      }
      break;
    }

    case "expire": {
      const guestWallet = await profileAuthority(client, guestProfile);
      const guestTokenAccount = associatedTokenAccount(guestWallet);
      const base = {
        payer: signer,
        guest: guestProfile,
        booking: bookingPda,
        globalConfig,
        escrowTokenAccount,
        guestTokenAccount,
        mint: USDC_MINT,
        tokenProgram: TOKEN_PROGRAM,
      };
      if (crossYear) {
        const [bookingDaysNext] = await findBookingDaysPda({
          property,
          year: checkOutYear,
        });
        instruction = await getExpireBookingCrossYearInstructionAsync({
          ...base,
          bookingDays,
          bookingDaysNext,
        });
      } else {
        instruction = await getExpireBookingInstructionAsync({
          ...base,
          bookingDays,
        });
      }
      break;
    }

    case "cancel": {
      const guestWallet = await profileAuthority(client, guestProfile);
      const guestTokenAccount = associatedTokenAccount(guestWallet);
      const hostReputation = address(booking.host.reputation);
      const [cpiAuthority] = await findCpiAuthorityPda();
      const [treasuryConfig] = await findTreasuryConfigPda();
      const [treasuryVault] = await findTreasuryVaultPda();
      const [treasuryPda] = await findTreasuryPdaPda();
      const base = {
        caller: signer,
        guestProfile,
        hostProfile,
        hostReputation,
        booking: bookingPda,
        globalConfig,
        escrowTokenAccount,
        guestTokenAccount,
        mint: USDC_MINT,
        cpiAuthority,
        treasuryConfig,
        treasuryVault,
        treasuryPda,
        staykeCoreProgram: STAYKE_CORE_PROGRAM_ADDRESS,
        staykeTreasuryProgram: STAYKE_TREASURY_PROGRAM_ADDRESS,
        tokenProgram: TOKEN_PROGRAM,
      };
      if (crossYear) {
        const [bookingDaysNext] = await findBookingDaysPda({
          property,
          year: checkOutYear,
        });
        instruction = await getHostCancelBookingCrossYearInstructionAsync({
          ...base,
          bookingDays,
          bookingDaysNext,
        });
      } else {
        instruction = await getHostCancelBookingInstructionAsync({
          ...base,
          bookingDays,
        });
      }
      break;
    }

    case "starts": {
      const [cpiAuthority] = await findCpiAuthorityPda();
      instruction = await getBookingStartsInstructionAsync({
        payer: signer,
        booking: bookingPda,
        guest: guestProfile,
        hostProfile,
        cpiAuthority,
        globalConfig,
        staykeCore: STAYKE_CORE_PROGRAM_ADDRESS,
      });
      break;
    }

    case "completes": {
      instruction = getBookingCompletesInstruction({
        payer: signer,
        booking: bookingPda,
      });
      break;
    }

    case "release": {
      const hostTokenAccount = associatedTokenAccount(wallet);
      const [cpiAuthority] = await findCpiAuthorityPda();
      const [platformVault] = await findPlatformVaultPda();
      instruction = await getReleaseFundsInstructionAsync({
        payer: signer,
        guestProfile,
        hostProfile,
        booking: bookingPda,
        globalConfig,
        escrowTokenAccount,
        hostTokenAccount,
        platformVault,
        mint: USDC_MINT,
        cpiAuthority,
        staykeCoreProgram: STAYKE_CORE_PROGRAM_ADDRESS,
        tokenProgram: TOKEN_PROGRAM,
      });
      break;
    }
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

  return { booking: bookingPda, tx };
}
