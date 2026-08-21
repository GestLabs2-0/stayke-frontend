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

import { findPlatformVaultPda } from "@GestLabs2-0/stayke-config";
import {
  fetchMaybeUserProfile,
  STAYKE_CORE_PROGRAM_ADDRESS,
} from "@GestLabs2-0/stayke-core";
import {
  findBookingDaysPda,
  findCpiAuthorityPda,
  findEscrowConfigPda,
  findEscrowTokenAccountPda,
  getGuestCancelBookingCrossYearInstructionAsync,
  getGuestCancelBookingInstructionAsync,
} from "@GestLabs2-0/stayke-escrow";
import type { SolanaClient } from "@/context/NetworkContext";
import { fromSolanaKitIns } from "@/helpers/web3Parsers";
import { USDC_MINT } from "@/lib/contracts/constants";
import type { Booking } from "@/types/api/booking";

/** Transición on-chain de huésped realizada desde la tarjeta. */
export type GuestBookingActionTx = "cancel";

export interface BuildGuestBookingActionParams {
  action: GuestBookingActionTx;
  /** La wallet del huésped (payer + caller/signer). */
  wallet: Address;
  booking: Booking;
  client: SolanaClient;
}

export interface BuiltGuestBookingTx {
  booking: Address;
  tx: VersionedTransaction;
}

const TOKEN_PROGRAM: Address = address(TOKEN_PROGRAM_ID.toBase58());

/** Una reserva que cruza dos años consecutivos es cross-year. */
function isCrossYear(checkIn: number, checkOut: number): boolean {
  return (
    new Date(checkIn * 1000).getFullYear() + 1 ===
    new Date(checkOut * 1000).getFullYear()
  );
}

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
 * Construye la transacción on-chain de cancelación del huésped y la envuelve en
 * una VersionedTransaction lista para firmar y enviar. Espeja el cancel del
 * anfitrión (misma configuración de escrow, mint y wrapper de transacción).
 */
export async function buildGuestBookingAction({
  action,
  wallet,
  booking,
  client,
}: BuildGuestBookingActionParams): Promise<BuiltGuestBookingTx> {
  const signer = createNoopSigner(wallet);
  const bookingPda = address(booking.idPda);
  const property = address(booking.propertyValues.pda);
  const hostProfile = address(booking.hostValues.userProfile);
  const guestProfile = address(booking.guestValues.userProfile);
  const guestReputation = address(booking.guestValues.reputation);
  const crossYear = isCrossYear(booking.checkIn, booking.checkOut);

  const [globalConfig] = await findEscrowConfigPda();
  const [bookingDays] = await findBookingDaysPda({
    property,
    checkIn: BigInt(booking.checkIn),
  });
  const [escrowTokenAccount] = await findEscrowTokenAccountPda({
    booking: bookingPda,
  });
  const hostWallet = await profileAuthority(client, hostProfile);
  const guestTokenAccount = associatedTokenAccount(wallet);
  const hostTokenAccount = associatedTokenAccount(hostWallet);
  const [cpiAuthority] = await findCpiAuthorityPda();
  const [platformVault] = await findPlatformVaultPda();

  let instruction: Instruction;

  switch (action) {
    case "cancel": {
      const base = {
        caller: signer,
        guestProfile,
        hostProfile,
        guestReputation,
        booking: bookingPda,
        globalConfig,
        escrowTokenAccount,
        guestTokenAccount,
        hostTokenAccount,
        platformVault,
        mint: USDC_MINT,
        cpiAuthority,
        staykeCoreProgram: STAYKE_CORE_PROGRAM_ADDRESS,
        tokenProgram: TOKEN_PROGRAM,
      };
      if (crossYear) {
        const [bookingDaysNext] = await findBookingDaysPda({
          property,
          checkIn: BigInt(booking.checkOut),
        });
        instruction = await getGuestCancelBookingCrossYearInstructionAsync({
          ...base,
          bookingDays,
          bookingDaysNext,
        });
      } else {
        instruction = await getGuestCancelBookingInstructionAsync({
          ...base,
          bookingDays,
        });
      }
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
