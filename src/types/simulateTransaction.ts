import type {
  Address,
  BlockhashLifetimeConstraint,
  Instruction,
  TransactionSigner,
} from "@solana/kit";
import type { VersionedTransaction } from "@solana/web3.js";

import type { SolanaClient } from "@/context/NetworkContext";

/**
 * Kinds of failures detected by the pre-send simulation gate.
 *
 * - `instruction-custom`: the stayke program rejected the tx with a custom
 *   program error (Anchor error) — the most actionable case for users.
 * - `instruction`: a runtime instruction failure (e.g. `ArithmeticOverflow`).
 * - `transaction`: the whole tx was rejected before executing instructions
 *   (e.g. `BlockhashNotFound`, fees, signatures).
 * - `rpc`: the `simulateTransaction` RPC call itself failed.
 * - `unknown`: fallback when the failure cannot be classified.
 */
export type SimulationErrorKind =
  | "instruction-custom"
  | "instruction"
  | "transaction"
  | "rpc"
  | "unknown";

/**
 * Parsed, user-facing detail of a failed simulation.
 */
export interface ParsedTransactionError {
  kind: SimulationErrorKind;
  /** Failing instruction index, when the failure is instruction-scoped. */
  index?: number;
  /** Custom program error code, when `kind === "instruction-custom"`. */
  code?: number;
  /** Program address of the failing instruction, when known. */
  program?: Address;
  /** Stayke/Anchor error name extracted from the simulation logs. */
  name?: string;
  /** Ready-to-show message (neutral Spanish when mapped). */
  message: string;
}

/**
 * Outcome of simulating a transaction before sending it.
 */
export interface SimulationResult {
  /** `true` when the simulation completed without errors. */
  ok: boolean;
  /** Raw RPC logs; `null` when the tx never executed (e.g. bad blockhash). */
  logs: string[] | null;
  /** Parsed failure, present when `ok === false`. */
  error?: ParsedTransactionError;
}

/**
 * Input for `simulateInstruction`: the Kit-level pieces needed to compile and
 * encode a transaction (mirrors the old inline pipe in the contract builders).
 */
export interface SimulateInstructionArgs {
  client: SolanaClient;
  /** The stayke program instruction to build and simulate. */
  instruction: Instruction;
  /** Fee payer signer (can be a `createNoopSigner`; nothing is signed). */
  feePayer: TransactionSigner;
  /** Recent blockhash lifetime (blockhash + last valid block height). */
  latestBlockhash: BlockhashLifetimeConstraint;
}

/**
 * Input for `simulateVersionedTransaction`: a ready web3.js v1 transaction,
 * serialized to wire bytes before being simulated.
 */
export interface SimulateVersionedTransactionArgs {
  client: SolanaClient;
  /** Transaction ready to be signed and sent by the wallet. */
  transaction: VersionedTransaction;
}

/**
 * Result of `useSignAndSendTx.handleSignAndSend`.
 */
export interface SignAndSendTxResult {
  status: boolean;
  signature?: string;
  /** Present when status is false; surfaced by the flow-level toasts. */
  error?: unknown;
  /** `true` when the send was blocked by the pre-send simulation gate. */
  simulationFailed?: boolean;
}
