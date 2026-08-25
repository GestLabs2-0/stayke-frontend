import type {
  Base64EncodedWireTransaction,
  TransactionError,
} from "@solana/kit";
import {
  appendTransactionMessageInstruction,
  compileTransaction,
  createTransactionMessage,
  getTransactionEncoder,
  pipe,
  setTransactionMessageFeePayerSigner,
  setTransactionMessageLifetimeUsingBlockhash,
} from "@solana/kit";

import type { SolanaClient } from "@/context/NetworkContext";
import { getBookingErrorMessage } from "@/helpers/bookingErrors";
import type {
  ParsedTransactionError,
  SimulateInstructionArgs,
  SimulateVersionedTransactionArgs,
  SimulationResult,
} from "@/types/simulateTransaction";

/**
 * Pre-send transaction simulation gate.
 *
 * Compiles a transaction with the Solana Kit and runs `simulateTransaction`
 * (`sigVerify: false`) so on-chain errors can be caught **before** the wallet
 * signs and the real send happens. The response is parsed into a
 * user-facing message, preferring mapped stayke/Anchor error names.
 */

/** Generic fallback shown when the failure could not be mapped. */
export const DEFAULT_SIMULATION_ERROR =
  "No pudimos validar tu transacción on-chain. Inténtalo de nuevo.";

/** Transaction-level rejections (whole tx failed before executing). */
const TRANSACTION_ERROR_MESSAGES: Record<string, string> = {
  BlockhashNotFound:
    "La transacción expiró. Prepara la operación nuevamente e inténtalo.",
  SignatureFailure: "La transacción no pudo validar las firmas requeridas.",
  InsufficientFundsForFee:
    "No tienes suficiente saldo para cubrir la tarifa de la transacción.",
  AccountInUse: "Una cuenta de la transacción está en uso. Inténtalo de nuevo.",
  AccountNotFound: "Una cuenta requerida por la transacción no existe.",
  InvalidAccountIndex: "La transacción hace referencia a una cuenta inválida.",
  MissingSignatureForFee:
    "La cuenta que paga la tarifa no está firmada correctamente.",
};

/** Runtime instruction failures reported by the VM. */
const INSTRUCTION_ERROR_MESSAGES: Record<string, string> = {
  AccountNotInitialized: "Una cuenta requerida aún no está inicializada.",
  AccountDataTooSmall: "El espacio de una cuenta es insuficiente.",
  InsufficientFunds: "La operación requiere más fondos de los disponibles.",
  ArithmeticOverflow: "La operación excedió los límites numéricos on-chain.",
  IncorrectProgramId: "El programa de una instrucción no es el esperado.",
  InvalidInstructionData:
    "Los datos de una instrucción no son válidos para el programa.",
  MissingRequiredSignature: "Falta una firma requerida por la transacción.",
};

/**
 * Extra stayke error names (beyond the booking map in `helpers/bookingErrors`)
 * surfaced by the on-chain flows in this app: reviews, host/guest actions,
 * disputes and treasury. Keyed by the Anchor error code name.
 */
const STAYKE_ERROR_MESSAGES: Record<string, string> = {
  // escrow — booking lifecycle
  BOOKING_NOT_ACCEPTED:
    "La reserva debe estar aceptada por el anfitrión para continuar.",
  BOOKING_NOT_ACTIVE:
    "La reserva debe estar en curso para completar la estadía.",
  BOOKING_NOT_COMPLETED:
    "La reserva debe estar completada para liberar los fondos.",
  BOOKING_NOT_DISPUTABLE:
    "La reserva debe estar activa o completada para abrir una disputa.",
  EXCEEDED_ACCEPT_TIME: "El tiempo para aceptar la reserva ya expiró.",
  RELEASE_WINDOW_NOT_ELAPSED:
    "Aún no han pasado las 24 horas para liberar los fondos.",
  REVIEW_ALREADY_SUBMITTED: "Ya enviaste tu reseña para esta reserva.",
  TOO_EARLY_TO_ACTIVATE:
    "Aún no es hora de iniciar la estadía (fecha de check-in no alcanzada).",
  TOO_EARLY_TO_COMPLETE:
    "Aún no es hora de completar la estadía (fecha de check-out no alcanzada).",
  UNAUTHORIZED_HOST: "Solo el anfitrión puede ejecutar esta acción.",
  UNAUTHORIZED_CANCELLATION:
    "Solo el huésped o el anfitrión pueden cancelar esta reserva.",
  INVALID_BOOKING_STATUS: "El estado de la reserva no permite esta acción.",
  DATES_UNBOOKED: "Las fechas seleccionadas no están reservadas.",
  INVALID_HOST: "El anfitrión no corresponde a este alojamiento.",
  // escrow — verification / funds
  USER_NOT_VERIFIED: "Tu identidad on-chain aún no está verificada.",
  USER_BANNED: "Tu cuenta está suspendida y no puede realizar operaciones.",
  INSUFFICIENT_DEPOSIT:
    "Tu depósito es insuficiente para esta operación. Auméntalo e inténtalo de nuevo.",
  INSUFFICIENT_FUNDS:
    "No tienes suficiente saldo (USDC) para cubrir el total de esta operación.",
  INVALID_TOKEN_MINT:
    "El token configurado no coincide con USDC en esta operación.",
  // disputes
  DISPUTE_NOT_OPEN: "La disputa no está abierta para esta acción.",
  ESCALATION_WINDOW_NOT_ELAPSED:
    "Aún no ha pasado la ventana para escalar la disputa.",
  UNAUTHORIZED_DISPUTE_INITIATOR:
    "Solo quien abrió la disputa puede ejecutar esta acción.",
  UNAUTHORIZED_DISPUTE_SOLVER: "No tienes permisos para resolver esta disputa.",
  EVIDENCE_LINKED: "La evidencia ya fue vinculada a la disputa.",
  // treasury
  DEPOSIT_TOO_LOW: "El depósito no alcanza el mínimo requerido.",
  INSUFFICIENT_BALANCE: "Tu saldo es insuficiente para retirar ese monto.",
  ZERO_WITHDRAWAL: "No puedes retirar un monto cero.",
  ALREADY_INITIALIZED: "La cuenta ya fue inicializada previamente.",
  // core
  USER_PROFILE_ALREADY_LINKED:
    "Tu identidad ya está vinculada a un perfil on-chain.",
  MAX_LISTINGS_REACHED: "Alcanzaste el límite de alojamientos publicados.",
  INVALID_LISTING_ID: "El identificador del alojamiento no es válido.",
  IDENTITY_BANNED: "Tu identidad está suspendida en la plataforma.",
  IDENTITY_FROZEN: "Tu identidad está congelada temporalmente.",
};

const ANCHOR_ERROR_CODE_RE = /Error Code:\s*([A-Za-z0-9_]+)/;

/** Pulls the Anchor error code name out of simulation logs, if present. */
function extractAnchorErrorName(logs: string[] | null): string | undefined {
  if (!logs) return undefined;
  for (const line of logs) {
    const match = ANCHOR_ERROR_CODE_RE.exec(line);
    if (match) return match[1];
  }
  return undefined;
}

/** Maps a stayke/Anchor error name to a neutral Spanish message. */
function messageForStaykeName(name: string): string | null {
  return (
    getBookingErrorMessage(name) ??
    STAYKE_ERROR_MESSAGES[name.toUpperCase()] ??
    null
  );
}

/** Builds the parsed error for a failed simulation response. */
function parseFailedSimulation(
  err: TransactionError | null,
  logs: string[] | null,
): ParsedTransactionError {
  const name = extractAnchorErrorName(logs);

  if (err === null) {
    return { kind: "unknown", message: DEFAULT_SIMULATION_ERROR };
  }

  if (typeof err === "string") {
    return {
      kind: "transaction",
      message:
        TRANSACTION_ERROR_MESSAGES[err] ??
        `La transacción fue rechazada por la red (${err}).`,
    };
  }

  if ("InstructionError" in err) {
    const [index, instructionError] = err.InstructionError;
    if (
      typeof instructionError === "object" &&
      instructionError !== null &&
      "Custom" in instructionError
    ) {
      const code = Number(instructionError.Custom);
      return {
        kind: "instruction-custom",
        index,
        name,
        code,
        message:
          (name ? messageForStaykeName(name) : null) ??
          `El programa on-chain rechazó la operación (código ${code}).`,
      };
    }
    return {
      kind: "instruction",
      index,
      name,
      message:
        typeof instructionError === "string"
          ? (INSTRUCTION_ERROR_MESSAGES[instructionError] ??
            `La instrucción falló durante la simulación (${instructionError}).`)
          : DEFAULT_SIMULATION_ERROR,
    };
  }

  if ("DuplicateInstruction" in err) {
    return {
      kind: "transaction",
      index: err.DuplicateInstruction,
      message: "La transacción repite una instrucción del mismo programa.",
    };
  }

  if ("InsufficientFundsForRent" in err) {
    return {
      kind: "transaction",
      message: "No hay fondos suficientes para el alquiler de la cuenta.",
    };
  }

  if ("ProgramExecutionTemporarilyRestricted" in err) {
    return {
      kind: "transaction",
      message:
        "La ejecución del programa está temporalmente restringida por la red.",
    };
  }

  return { kind: "unknown", message: DEFAULT_SIMULATION_ERROR };
}

/**
 * Simulates an already-encoded transaction (wire format, base64) using the
 * Solana Kit RPC client. Never sends nor signs anything.
 */
export async function simulateEncodedTransaction(
  client: SolanaClient,
  encodedTransaction: Base64EncodedWireTransaction,
): Promise<SimulationResult> {
  try {
    const { value } = await client.rpc
      .simulateTransaction(encodedTransaction, {
        encoding: "base64",
        sigVerify: false,
        innerInstructions: true,
      })
      .send();

    if (value.err === null) {
      return { ok: true, logs: value.logs };
    }
    console.error(value.logs);
    return {
      ok: false,
      logs: value.logs,
      error: parseFailedSimulation(value.err, value.logs),
    };
  } catch (rpcError) {
    console.error("simulateTransaction RPC failed:", rpcError);
    return {
      ok: false,
      logs: null,
      error: { kind: "rpc", message: DEFAULT_SIMULATION_ERROR },
    };
  }
}

/**
 * Simulates a Kit transaction built from an instruction — the fee payer can be
 * a `createNoopSigner` since nothing is signed (`sigVerify: false`).
 */
export async function simulateInstruction({
  client,
  instruction,
  feePayer,
  latestBlockhash,
}: SimulateInstructionArgs): Promise<SimulationResult> {
  const compiledTransaction = pipe(
    createTransactionMessage({ version: 0 }),
    (transaction) => setTransactionMessageFeePayerSigner(feePayer, transaction),
    (transaction) =>
      setTransactionMessageLifetimeUsingBlockhash(latestBlockhash, transaction),
    (transaction) =>
      appendTransactionMessageInstruction(instruction, transaction),
    (transaction) => compileTransaction(transaction),
  );
  const encodedTransaction = Buffer.from(
    getTransactionEncoder().encode(compiledTransaction),
  ).toString("base64");

  return simulateEncodedTransaction(
    client,
    encodedTransaction as Base64EncodedWireTransaction,
  );
}

/**
 * Simulates a versioned transaction ready to be sent by the wallet, by
 * serializing it to wire bytes. Used as the pre-send gate before signing.
 */
export async function simulateVersionedTransaction({
  client,
  transaction,
}: SimulateVersionedTransactionArgs): Promise<SimulationResult> {
  const encodedTransaction = Buffer.from(transaction.serialize()).toString(
    "base64",
  );

  return simulateEncodedTransaction(
    client,
    encodedTransaction as Base64EncodedWireTransaction,
  );
}
