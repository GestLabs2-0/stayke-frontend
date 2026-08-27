import type { Address, Instruction } from "@solana/kit";
import { createNoopSigner } from "@solana/kit";
import {
  PublicKey,
  SystemProgram,
  TransactionMessage,
  VersionedTransaction,
} from "@solana/web3.js";

import {
  findDisputePda,
  getOpenDisputeInstructionAsync,
} from "@GestLabs2-0/stayke-disputes";
import {
  findCpiAuthorityPda,
  findEscrowConfigPda,
  STAYKE_ESCROW_PROGRAM_ADDRESS,
} from "@GestLabs2-0/stayke-escrow";
import type { SolanaClient } from "@/context/NetworkContext";
import { fromSolanaKitIns } from "@/helpers/web3Parsers";
import { FEE_PAYER } from "@/shared/constants";

export interface BuildOpenDisputeParams {
  /** Wallet del initiator (quien abre la disputa; también payer). */
  wallet: Address;
  /** PDA de perfil on-chain del initiator. */
  initiatorProfile: Address;
  /** PDA on-chain de la reserva. */
  bookingId: Address;
  client: SolanaClient;
}

export interface BuiltOpenDisputeTx {
  booking: Address;
  dispute: Address;
  tx: VersionedTransaction;
}

/**
 * Construye la instrucción on-chain `openDispute` del programa stayke-disputes
 * (P2P) y la envuelve en una VersionedTransaction lista para firmar y enviar.
 * El PDA de la disputa se deriva del booking.
 */
export async function buildOpenDisputeAction({
  wallet,
  initiatorProfile,
  bookingId,
  client,
}: BuildOpenDisputeParams): Promise<BuiltOpenDisputeTx> {
  const signer = createNoopSigner(wallet);
  const payer = createNoopSigner(FEE_PAYER);

  const [globalConfig] = await findEscrowConfigPda();
  const [cpiAuthority] = await findCpiAuthorityPda();
  const [dispute] = await findDisputePda({ booking: bookingId });

  const instruction: Instruction = await getOpenDisputeInstructionAsync({
    payer,
    initiator: signer,
    initiatorProfile,
    booking: bookingId,
    dispute,
    cpiAuthority,
    globalConfig,
    staykeEscrowProgram: STAYKE_ESCROW_PROGRAM_ADDRESS,
    systemProgram: SystemProgram.programId.toBase58() as Address,
  });

  const web3Instruction = fromSolanaKitIns(instruction);

  const { value: latestBlockhash } = await client.rpc
    .getLatestBlockhash()
    .send();

  const tx = new VersionedTransaction(
    new TransactionMessage({
      instructions: [web3Instruction],
      payerKey: new PublicKey(FEE_PAYER),
      recentBlockhash: latestBlockhash.blockhash,
    }).compileToV0Message(),
  );

  return { booking: bookingId, dispute, tx };
}
