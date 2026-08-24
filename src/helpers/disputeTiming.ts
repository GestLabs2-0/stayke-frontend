export const DISPUTE_P2P_WINDOW_SECONDS = 24 * 60 * 60; // 86400

/**
 * Determina si la ventana P2P de 24 horas para resolver la disputa ha expirado.
 * Tras 24 horas, la disputa pasa a estar habilitada para escalamiento a Stayke.
 */
export function isDisputeEscalationWindowElapsed(openedAt: number): boolean {
  if (!openedAt || openedAt <= 0) return false;
  const openedSec = openedAt > 1e11 ? openedAt / 1000 : openedAt;
  return Date.now() / 1000 > openedSec + DISPUTE_P2P_WINDOW_SECONDS;
}

/**
 * Retorna los segundos restantes dentro de la ventana de 24 horas (0 si expiró).
 */
export function disputeP2PRemainingSeconds(openedAt: number): number {
  if (!openedAt || openedAt <= 0) return 0;
  const openedSec = openedAt > 1e11 ? openedAt / 1000 : openedAt;
  const elapsed = Date.now() / 1000 - openedSec;
  return Math.max(0, DISPUTE_P2P_WINDOW_SECONDS - elapsed);
}
