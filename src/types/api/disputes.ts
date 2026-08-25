import {
  DisputeParty,
  DisputeState,
  PenaltySeverity,
} from "@GestLabs2-0/stayke-disputes";
import type { BookingStatus } from "@GestLabs2-0/stayke-escrow";
import type { ApiPaginatedResponse } from "../http";

export { DisputeParty, DisputeState, PenaltySeverity };

/**
 * Fallo emitido por la plataforma al resolver una disputa escalada. Es un enum
 * local del backend (NO viene del SDK), por eso se define aquí con su orden.
 */
export enum DisputeJudgement {
  GuestFavored = 0,
  HostFavored = 1,
  NoFaultFound = 2,
  MaliciousClaim = 3,
}

/** Booking embebido en cada disputa de GET /disputes (shape plano, sin joins). */
export interface DisputeBooking {
  idPda: string;
  property_pda: string;
  guest_profile_pda: string;
  host_profile_pda: string;
  escrow: string;
  totalPrice: number;
  /** Timestamp Unix (segundos) del check-in. */
  checkIn: number;
  /** Timestamp Unix (segundos) del check-out. */
  checkOut: number;
  status: BookingStatus;
  resellable: boolean;
}

/** Disputa devuelta por GET /api/v1.0/disputes. */
export interface Dispute {
  /** PDA on-chain de la disputa (44 caracteres base58). */
  disputePda: string;
  bookingPda: string;
  booking: DisputeBooking;
  /** Quién abrió la disputa: Guest (0) | Host (1). */
  openedBy: DisputeParty;
  /** Estado on-chain: OpenP2P (0) | Escalated (1) | ResolvedByP2P (2) | ResolvedByAdmin (3) | Closed (4). */
  state: DisputeState;
  /** Timestamp Unix (segundos) de apertura. */
  openedAt: number;
  /** Fecha de apertura en ISO. */
  openedAtDate: string;
  /** Fallo de la plataforma; null si aún no se emitió. */
  judgement: DisputeJudgement | null;
  /** Severidad de la penalización; null si no aplica. */
  severity: PenaltySeverity | null;
}

/** Query params de GET /api/v1.0/disputes. */
export interface GetDisputesParams {
  severity?: PenaltySeverity;
  judgement?: DisputeJudgement;
  state?: DisputeState;
  /** Wallet de quien abrió la disputa. */
  initiator?: string;
  /** Wallet contra quien se abrió la disputa. */
  accused?: string;
  /** Filtra por fecha de apertura posterior (YYYY-MM-DD). */
  initiatedAtDate?: string;
  limit?: number;
  offset?: number;
}

/** Respuesta paginada de GET /api/v1.0/disputes. */
export interface DisputeListResult extends ApiPaginatedResponse<Dispute> {}

/** Tipo derivado de la disputa para las secciones de la pantalla. */
export type DisputeKind = "escalated" | "p2p";

/** Filtro de rol: cómo aparece el usuario autenticado en la disputa. */
export type DisputeRoleFilter = "initiator" | "accused";

/** Etiquetas legibles (español) de cada estado de disputa. */
export const DISPUTE_STATE_LABELS: Record<DisputeState, string> = {
  [DisputeState.OpenP2P]: "Abierta (P2P)",
  [DisputeState.Escalated]: "Escalada",
  [DisputeState.ResolvedByP2P]: "Resuelta entre las partes",
  [DisputeState.ResolvedByAdmin]: "Resuelta por Stayke",
  [DisputeState.Closed]: "Cerrada",
};

/** Etiquetas legibles (español) de cada fallo de la plataforma. */
export const DISPUTE_JUDGEMENT_LABELS: Record<DisputeJudgement, string> = {
  [DisputeJudgement.GuestFavored]: "A favor del huésped",
  [DisputeJudgement.HostFavored]: "A favor del anfitrión",
  [DisputeJudgement.NoFaultFound]: "Sin culpas",
  [DisputeJudgement.MaliciousClaim]: "Reclamo malicioso",
};

/** Etiquetas legibles (español) de cada severidad de penalización. */
export const SEVERITY_LABELS: Record<PenaltySeverity, string> = {
  [PenaltySeverity.Low]: "Baja",
  [PenaltySeverity.Medium]: "Media",
  [PenaltySeverity.High]: "Alta",
};

/**
 * Clasifica una disputa en escalada o P2P.
 *
 * Una disputa escalada recibe fallo de la plataforma (judgement !== null) o está
 * en el camino de escalamiento (state Escalated / ResolvedByAdmin). El estado
 * Closed es terminal desde ambos caminos: si conserva fallo fue resuelta por la
 * plataforma; si no, se resolvió entre las partes.
 */
export function disputeKind(
  dispute: Pick<Dispute, "state" | "judgement">,
): DisputeKind {
  const escalated =
    dispute.judgement !== null ||
    dispute.state === DisputeState.Escalated ||
    dispute.state === DisputeState.ResolvedByAdmin;
  return escalated ? "escalated" : "p2p";
}
