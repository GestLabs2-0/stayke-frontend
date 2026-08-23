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
  getHostReviewInstructionAsync,
} from "@GestLabs2-0/stayke-escrow";
import type { SolanaClient } from "@/context/NetworkContext";
import { fromSolanaKitIns } from "@/helpers/web3Parsers";
import type { Booking } from "@/types/api/booking";

export interface BuildHostReviewParams {
  /** La wallet del anfitrión (payer + host/signer). */
  wallet: Address;
  booking: Booking;
  client: SolanaClient;
  /** Puntaje de la reseña (1-5). */
  score: number;
}

export interface BuiltHostReviewTx {
  booking: Address;
  tx: VersionedTransaction;
}

/**
 * Construye la instrucción on-chain `hostReview` (el anfitrión reseña al
 * huésped, setea booking.guestReview = score) y la envuelve en una
 * VersionedTransaction lista para firmar y enviar.
 */
export async function buildHostReviewAction({
  wallet,
  booking,
  client,
  score,
}: BuildHostReviewParams): Promise<BuiltHostReviewTx> {
  const host = createNoopSigner(wallet);
  const bookingPda = address(booking.idPda);
  const hostProfile = address(booking.host.userProfile);
  const guestProfile = address(booking.guest.userProfile);
  const guestReputation = address(booking.guest.reputation);

  const [globalConfig] = await findEscrowConfigPda();
  const [cpiAuthority] = await findCpiAuthorityPda();

  const instruction: Instruction = await getHostReviewInstructionAsync({
    host,
    hostProfile,
    guestProfile,
    guestReputation,
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
