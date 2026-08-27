import type { Address, Instruction } from "@solana/kit";
import { createNoopSigner } from "@solana/kit";
import {
  PublicKey,
  TransactionMessage,
  VersionedTransaction,
} from "@solana/web3.js";

import {
  findCpiAuthorityPda,
  findDisputePda,
  getSolveDisputeBeforeAdminInstructionAsync,
} from "@GestLabs2-0/stayke-disputes";
import {
  findEscrowConfigPda,
  STAYKE_ESCROW_PROGRAM_ADDRESS,
} from "@GestLabs2-0/stayke-escrow";
import type { SolanaClient } from "@/context/NetworkContext";
import { fromSolanaKitIns } from "@/helpers/web3Parsers";
import { FEE_PAYER } from "@/shared/constants";

export interface BuildSolveDisputeBeforeAdminParams {
  /** Wallet del initiator que abrió la disputa. */
  wallet: Address;
  /** PDA de perfil on-chain del initiator. */
  initiatorProfile: Address;
  /** PDA on-chain de la reserva. */
  bookingId: Address;
  client: SolanaClient;
}

export interface BuiltSolveDisputeBeforeAdminTx {
  booking: Address;
  dispute: Address;
  tx: VersionedTransaction;
}

/**
 * Construye la instrucción on-chain `solveDisputeBeforeAdmin` del programa stayke-disputes
 * para que el iniciador resuelva la disputa antes del escalamiento (dentro de las 24hs).
 */
export async function buildSolveDisputeBeforeAdminAction({
  wallet,
  initiatorProfile,
  bookingId,
  client,
}: BuildSolveDisputeBeforeAdminParams): Promise<BuiltSolveDisputeBeforeAdminTx> {
  const signer = createNoopSigner(wallet);

  const [globalConfig] = await findEscrowConfigPda();
  const [cpiAuthority] = await findCpiAuthorityPda();
  const [dispute] = await findDisputePda({ booking: bookingId });

  const instruction: Instruction =
    await getSolveDisputeBeforeAdminInstructionAsync({
      initiator: signer,
      initiatorProfile,
      dispute,
      booking: bookingId,
      cpiAuthority,
      globalConfig,
      staykeEscrowProgram: STAYKE_ESCROW_PROGRAM_ADDRESS,
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
