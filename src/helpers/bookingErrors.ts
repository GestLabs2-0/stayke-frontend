/**
 * Maps on-chain escrow errors to actionable, guest-facing messages.
 *
 * TS-STK-346: `createBooking` can fail against strict on-chain gates
 * (identity, deposit, banned, dates booked). sendAndSendTransaction throws a
 * web3 `SendTransactionError` whose message/logs carry the Anchor error name
 * or code; we match those tokens and return a clear Spanish message so the
 * guest knows exactly what to do next.
 */

const BOOKING_ERROR_MESSAGES: Record<string, string> = {
  USER_NOT_VERIFIED:
    "Tu identidad on-chain aún no está verificada. Verifícala antes de reservar.",
  USER_BANNED: "Tu cuenta está suspendida y no puede realizar reservas.",
  INSUFFICIENT_DEPOSIT:
    "Tu depósito es insuficiente para esta reserva. Aumenta tu depósito e inténtalo de nuevo.",
  INSUFFICIENT_FUNDS:
    "No tienes suficiente saldo (USDC) para cubrir el total de esta reserva.",
  DATES_ALREADY_BOOKED:
    "Algunas de las fechas seleccionadas ya están reservadas. Elige otras fechas.",
  ACTIVE_BOOKING_EXISTS: "Ya tienes una reserva activa en este alojamiento.",
  HOST_NOT_VERIFIED:
    "Este alojamiento aún no puede recibir reservas porque el anfitrión no está verificado.",
  HOST_CANNOT_BOOK_OWN_PROPERTY: "No puedes reservar tu propio alojamiento.",
  INVALID_BOOKING_DATES:
    "Las fechas seleccionadas no son válidas para este alojamiento.",
  WRONG_GUEST_PASSED: "No pudimos validar la cuenta de huésped.",
  INVALID_BOOKING_PROPERTY: "El alojamiento no está disponible para reserva.",
  CHECK_IN_PASSED: "La fecha de entrada ya pasó. Selecciona una fecha futura.",
};

/** normalized token (alphanumeric-uppercase) → message key */
const ERROR_ALIASES: Record<string, string> = {
  USERNOTVERIFIED: "USER_NOT_VERIFIED",
  USERBANNED: "USER_BANNED",
  INSUFFICIENTDEPOSIT: "INSUFFICIENT_DEPOSIT",
  INSUFFICIENTFUNDS: "INSUFFICIENT_FUNDS",
  DATESALREADYBOOKED: "DATES_ALREADY_BOOKED",
  ACTIVEBOOKINGEXISTS: "ACTIVE_BOOKING_EXISTS",
  HOSTNOTVERIFIED: "HOST_NOT_VERIFIED",
  HOSTCANNOTBOOKOWNPROPERTY: "HOST_CANNOT_BOOK_OWN_PROPERTY",
  INVALIDBOOKINGDATES: "INVALID_BOOKING_DATES",
  WRONGGUESTPASSED: "WRONG_GUEST_PASSED",
  INVALIDBOOKINGPROPERTY: "INVALID_BOOKING_PROPERTY",
  CHECKINPASSED: "CHECK_IN_PASSED",
};

const extractErrorText = (error: unknown): string => {
  if (error instanceof Error) {
    const logs = (error as Error & { logs?: string[] }).logs;
    return logs ? `${error.message}\n${logs.join("\n")}` : error.message;
  }
  if (typeof error === "string") return error;
  return "";
};

/** Returns an actionable Spanish message for an escrow booking error, or null. */
export function getBookingErrorMessage(error: unknown): string | null {
  const normalized = extractErrorText(error)
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "");

  for (const [token, key] of Object.entries(ERROR_ALIASES)) {
    if (normalized.includes(token)) return BOOKING_ERROR_MESSAGES[key];
  }
  return null;
}

/** Default message when no specific on-chain gate matched. */
export const DEFAULT_BOOKING_ERROR =
  "La reserva no se pudo completar on-chain. Revisa tu conexión e inténtalo de nuevo.";
