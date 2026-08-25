/**
 * Mapea los errores on-chain del programa stayke-treasury a mensajes claros en español.
 */

const TREASURY_ERROR_MESSAGES: Record<string, string> = {
  ALREADY_INITIALIZED: "La tesorería ya se encuentra inicializada.",
  DEPOSIT_TOO_LOW: "El monto a depositar es inferior al mínimo requerido.",
  INVALID_TREASURY_VAULT: "La cuenta de la bóveda de tesorería no es válida.",
  INSUFFICIENT_BALANCE:
    "No tienes suficiente saldo de garantía para retirar el monto solicitado.",
  ZERO_WITHDRAWAL: "El monto a retirar debe ser mayor a cero.",
  ACTIVE_BOOKING_EXISTS:
    "Tienes una reserva activa y no puedes retirar tu garantía.",
  USER_BANNED: "Tu cuenta está suspendida y no puede realizar esta operación.",
  UNAUTHORIZED: "No tienes autorización para realizar esta acción.",
  LENDING_NOT_ENABLED: "El servicio de préstamos no está habilitado.",
  USER_NOT_VERIFIED: "Tu identidad on-chain aún no está verificada.",
  INSUFFICIENT_FUNDS:
    "No tienes suficiente saldo de USDC en tu wallet para realizar este depósito.",
};

const ERROR_ALIASES: Record<string, string> = {
  ALREADYINITIALIZED: "ALREADY_INITIALIZED",
  DEPOSITTOOLOW: "DEPOSIT_TOO_LOW",
  INVALIDTREASURYVAULT: "INVALID_TREASURY_VAULT",
  INSUFFICIENTBALANCE: "INSUFFICIENT_BALANCE",
  ZEROWITHDRAWAL: "ZERO_WITHDRAWAL",
  ACTIVEBOOKINGEXISTS: "ACTIVE_BOOKING_EXISTS",
  USERBANNED: "USER_BANNED",
  UNAUTHORIZED: "UNAUTHORIZED",
  LENDINGNOTENABLED: "LENDING_NOT_ENABLED",
  USERNOTVERIFIED: "USER_NOT_VERIFIED",
  INSUFFICIENTFUNDS: "INSUFFICIENT_FUNDS",
  // Error codes on-chain
  "6000": "ALREADY_INITIALIZED",
  "0X1770": "ALREADY_INITIALIZED",
  "6001": "DEPOSIT_TOO_LOW",
  "0X1771": "DEPOSIT_TOO_LOW",
  "6002": "INVALID_TREASURY_VAULT",
  "0X1772": "INVALID_TREASURY_VAULT",
  "6003": "INSUFFICIENT_BALANCE",
  "0X1773": "INSUFFICIENT_BALANCE",
  "6004": "ZERO_WITHDRAWAL",
  "0X1774": "ZERO_WITHDRAWAL",
  "6005": "ACTIVE_BOOKING_EXISTS",
  "0X1775": "ACTIVE_BOOKING_EXISTS",
  "6006": "USER_BANNED",
  "0X1776": "USER_BANNED",
  "6007": "UNAUTHORIZED",
  "0X1777": "UNAUTHORIZED",
  "6008": "LENDING_NOT_ENABLED",
  "0X1778": "LENDING_NOT_ENABLED",
};

const extractErrorText = (error: unknown): string => {
  if (error instanceof Error) {
    const logs = (error as Error & { logs?: string[] }).logs;
    return logs ? `${error.message}\n${logs.join("\n")}` : error.message;
  }
  if (typeof error === "string") return error;
  if (error && typeof error === "object" && "message" in error) {
    return String((error as { message: unknown }).message);
  }
  return "";
};

/** Retorna un mensaje en español amigable para un error de tesorería on-chain, o null. */
export function getTreasuryErrorMessage(error: unknown): string | null {
  const text = extractErrorText(error);
  const normalized = text.toUpperCase().replace(/[^A-Z0-9]/g, "");

  for (const [token, key] of Object.entries(ERROR_ALIASES)) {
    if (normalized.includes(token)) return TREASURY_ERROR_MESSAGES[key];
  }
  return null;
}

/** Mensaje por defecto cuando ningún error on-chain coincide específicamente. */
export const DEFAULT_TREASURY_ERROR =
  "No se pudo completar la operación en la tesorería. Revisa tu conexión e inténtalo de nuevo.";
