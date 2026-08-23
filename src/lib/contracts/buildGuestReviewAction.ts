import type { Address, Instruction } from "@solana/kit";
import { address, createNoopSigner } from "@solana/kit";
import {
  PublicKey,
  TransactionMessage,
  VersionedTransaction,
} from "@solana/web3.js";

import { STAYKE_CORE_PROGRAM_ADDRESS } from "@GestLabs2-0/stayke-core";
import {
  findCpiAuthorityPda,
  findEscrowConfigPda,
  getGuestReviewInstructionAsync,
} from "@GestLabs2-0/stayke-escrow";
import type { SolanaClient } from "@/context/NetworkContext";
import { fromSolanaKitIns } from "@/helpers/web3Parsers";
import type { Booking } from "@/types/api/booking";

export interface BuildGuestReviewParams {
  /** La wallet del huésped (payer + guest/signer). */
  wallet: Address;
  booking: Booking;
  client: SolanaClient;
  /** Puntaje de la reseña (1-5). */
  score: number;
}

export interface BuiltGuestReviewTx {
  booking: Address;
  tx: VersionedTransaction;
}

/**
 * Construye la instrucción on-chain `guestReview` (el huésped reseña al
 * anfitrión, setea booking.hostReview = score) y la envuelve en una
 * VersionedTransaction lista para firmar y enviar.
 */
export async function buildGuestReviewAction({
  wallet,
  booking,
  client,
  score,
}: BuildGuestReviewParams): Promise<BuiltGuestReviewTx> {
  const guest = createNoopSigner(wallet);
  const bookingPda = address(booking.idPda);
  const guestProfile = address(booking.guest.userProfile);
  const hostProfile = address(booking.host.userProfile);
  const hostReputation = address(booking.host.reputation);
  const listing = address(booking.property.pda);

  const [globalConfig] = await findEscrowConfigPda();
  const [cpiAuthority] = await findCpiAuthorityPda();

  const instruction: Instruction = await getGuestReviewInstructionAsync({
    guest,
    guestProfile,
    hostProfile,
    hostReputation,
    listing,
    booking: bookingPda,
    globalConfig,
    cpiAuthority,
    staykeCoreProgram: STAYKE_CORE_PROGRAM_ADDRESS,
    score,
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

  return { booking: bookingPda, tx };
}
