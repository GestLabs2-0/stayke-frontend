import type { PenaltySeverity } from "@GestLabs2-0/stayke-disputes";
import type {
  Dispute,
  DisputeJudgement,
  DisputeKind,
  DisputeRoleFilter,
} from "@/types/api/disputes";

// ── Estado de filtros de la pantalla ──

/** Estado completo de la barra de filtros de disputas. */
export interface DisputesFilterState {
  /** Fecha "desde" (YYYY-MM-DD): disputas abiertas después de esa fecha. */
  dateFrom: string;
  severity: PenaltySeverity | null;
  /** Cómo aparece el usuario en la disputa. */
  role: DisputeRoleFilter | null;
  judgement: DisputeJudgement | null;
  type: DisputeKind | null;
}

export const EMPTY_DISPUTES_FILTERS: DisputesFilterState = {
  dateFrom: "",
  severity: null,
  role: null,
  judgement: null,
  type: null,
};

/** True cuando hay al menos un filtro activo (vista unificada). */
export function disputesFiltersActive(f: DisputesFilterState): boolean {
  return (
    f.dateFrom !== "" ||
    f.severity !== null ||
    f.role !== null ||
    f.judgement !== null ||
    f.type !== null
  );
}

// ── DisputeFilters ──

export interface DisputeFiltersProps {
  value: DisputesFilterState;
  /** Total de disputas visibles según los filtros actuales. */
  total: number;
  onChange: (next: DisputesFilterState) => void;
  onClear: () => void;
}

// ── DisputeCard ──

export interface DisputeCardProps {
  dispute: Dispute;
  /** Wallet del usuario autenticado, para derivar su rol en la disputa. */
  userWallet: string | null;
}

// ── DisputeList ──

export interface DisputeListProps {
  disputes: Dispute[];
  userWallet: string | null;
  /** Muestra skeleton mientras carga y no hay datos. */
  loading?: boolean;
  /** Cantidad de items por página (default 8). */
  pageSize?: number;
  emptyMessage?: string;
  emptyDescription?: string;
}

// ── DisputeSection ──

export interface DisputeSectionProps {
  kind: DisputeKind;
  title: string;
  /** Línea que explica qué significa la sección. */
  description?: string;
  disputes: Dispute[];
  userWallet: string | null;
  loading?: boolean;
  emptyMessage?: string;
  emptyDescription?: string;
}

// ── DisputeListSkeleton ──

export interface DisputeListSkeletonProps {
  count?: number;
}

/** Rol del usuario autenticado dentro de una disputa. */
export type UserRoleInDispute = "initiator" | "accused" | null;
