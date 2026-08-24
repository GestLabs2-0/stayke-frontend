import type { Address, Instruction } from "@solana/kit";
import {
  PublicKey,
  TransactionMessage,
  VersionedTransaction,
} from "@solana/web3.js";

import { STAYKE_CORE_PROGRAM_ADDRESS } from "@GestLabs2-0/stayke-core";
import {
  findCpiAuthorityPda,
  findDisputePda,
  getCloseDisputeInstructionAsync,
} from "@GestLabs2-0/stayke-disputes";
import {
  findEscrowConfigPda,
  STAYKE_ESCROW_PROGRAM_ADDRESS,
} from "@GestLabs2-0/stayke-escrow";
import type { SolanaClient } from "@/context/NetworkContext";
import { fromSolanaKitIns } from "@/helpers/web3Parsers";
import { fetchProfileAuthority } from "@/lib/contracts/utils/fetchProfileAuthority";

export interface BuildCloseDisputeParams {
  /** Wallet del pagador de la transacción (puede ser cualquiera, es permissionless). */
  wallet: Address;
  /** PDA on-chain de la reserva. */
  bookingId: Address;
  /** PDA de perfil on-chain del huésped. */
  guestProfile: Address;
  /** PDA de perfil on-chain del anfitrión. */
  hostProfile: Address;
  /** PDA de perfil on-chain de quien abrió la disputa. */
  openerProfile: Address;
  client: SolanaClient;
}

export interface BuiltCloseDisputeTx {
  booking: Address;
  dispute: Address;
  tx: VersionedTransaction;
}

/**
 * Construye la instrucción on-chain `closeDispute` del programa stayke-disputes
 * (permissionless) para cerrar una disputa en estado ResolvedByAdmin o ResolvedByP2P.
 */
export async function buildCloseDisputeAction({
  wallet,
  bookingId,
  guestProfile,
  hostProfile,
  openerProfile,
  client,
}: BuildCloseDisputeParams): Promise<BuiltCloseDisputeTx> {
  const [globalConfig] = await findEscrowConfigPda();
  const [cpiAuthority] = await findCpiAuthorityPda();
  const [dispute] = await findDisputePda({ booking: bookingId });
  const openerWallet = await fetchProfileAuthority(client, openerProfile);

  const instruction: Instruction = await getCloseDisputeInstructionAsync({
    dispute,
    booking: bookingId,
    guestProfile,
    hostProfile,
    openerWallet,
    globalConfig,
    cpiAuthority,
    staykeCoreProgram: STAYKE_CORE_PROGRAM_ADDRESS,
    staykeEscrowProgram: STAYKE_ESCROW_PROGRAM_ADDRESS,
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

  return { booking: bookingId, dispute, tx };
}
