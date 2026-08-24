/**
 * Mapea los errores on-chain del programa stayke-disputes a mensajes claros en español.
 */

const DISPUTE_ERROR_MESSAGES: Record<string, string> = {
  UNAUTHORIZED_DISPUTE_SOLVER:
    "Solo el usuario que abrió la disputa puede resolverla.",
  P2P_WINDOW_ELAPSED:
    "El plazo de 24 horas para resolver la disputa entre las partes ha vencido.",
  DISPUTE_NOT_OPEN_P2_P: "La disputa no se encuentra en estado abierto P2P.",
  DISPUTE_NOT_OPEN: "La disputa ya se encuentra resuelta o cerrada.",
  DISPUTE_NOT_RESOLVED:
    "La disputa debe estar resuelta por las partes o por la plataforma antes de cerrarse.",
  INVALID_OPENER_WALLET:
    "La cuenta destino no coincide con la wallet de quien abrió la disputa.",
  ESCALATION_WINDOW_NOT_ELAPSED:
    "Aún no han transcurrido las 24 horas requeridas para escalar la disputa.",
  DISPUTE_NOT_ESCALATED:
    "Esta acción solo se puede realizar sobre una disputa escalada.",
  USER_BANNED: "Tu cuenta se encuentra suspendida.",
  USER_NOT_VERIFIED: "Tu identidad on-chain no está verificada.",
  UNBOUND_BOOKING: "La disputa no corresponde a esta reserva.",
  UNBOUND_BOOKING_ACCOUNT:
    "El perfil no se encuentra vinculado a esta reserva.",
};

const ERROR_ALIASES: Record<string, string> = {
  UNAUTHORIZEDDISPUTESOLVER: "UNAUTHORIZED_DISPUTE_SOLVER",
  P2PWINDOWELAPSED: "P2P_WINDOW_ELAPSED",
  DISPUTENOTOPENP2P: "DISPUTE_NOT_OPEN_P2_P",
  DISPUTENOTOPEN: "DISPUTE_NOT_OPEN",
  DISPUTENOTRESOLVED: "DISPUTE_NOT_RESOLVED",
  INVALIDOPENERWALLET: "INVALID_OPENER_WALLET",
  ESCALATIONWINDOWNOTELAPSED: "ESCALATION_WINDOW_NOT_ELAPSED",
  DISPUTENOTESCALATED: "DISPUTE_NOT_ESCALATED",
  USERBANNED: "USER_BANNED",
  USERNOTVERIFIED: "USER_NOT_VERIFIED",
  UNBOUNDBOOKING: "UNBOUND_BOOKING",
  UNBOUNDBOOKINGACCOUNT: "UNBOUND_BOOKING_ACCOUNT",
};

const extractErrorText = (error: unknown): string => {
  if (error instanceof Error) {
    const logs = (error as Error & { logs?: string[] }).logs;
    return logs ? `${error.message}\n${logs.join("\n")}` : error.message;
  }
  if (typeof error === "string") return error;
  return "";
};

/** Retorna un mensaje en español amigable para un error de disputa on-chain. */
export function getDisputeErrorMessage(error: unknown): string | null {
  const normalized = extractErrorText(error)
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "");

  for (const [token, key] of Object.entries(ERROR_ALIASES)) {
    if (normalized.includes(token)) return DISPUTE_ERROR_MESSAGES[key];
  }
  return null;
}

/** Mensaje por defecto cuando ningún error on-chain coincide específicamente. */
export const DEFAULT_DISPUTE_ERROR =
  "No se pudo completar la operación en la disputa. Revisa tu conexión e inténtalo de nuevo.";
