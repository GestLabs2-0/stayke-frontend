import type { LucideIcon } from "lucide-react";
import {
  Archive,
  ArrowUpCircle,
  CheckCircle2,
  Handshake,
  ShieldCheck,
} from "lucide-react";

import { DisputeState, PenaltySeverity } from "@GestLabs2-0/stayke-disputes";
import type { DisputeKind } from "@/types/api/disputes";
import { DisputeJudgement } from "@/types/api/disputes";

/**
 * Clases semánticas por estado de disputa. El color es señal de estado y
 * siempre va acompañado del texto de la etiqueta para no depender solo del
 * color (WCAG: color no es el único portador de significado).
 */
export const DISPUTE_STATE_BADGE_CLASSES: Record<DisputeState, string> = {
  [DisputeState.OpenP2P]: "bg-sky-100 text-sky-800",
  [DisputeState.Escalated]: "bg-amber-100 text-amber-800",
  [DisputeState.ResolvedByP2P]: "bg-teal-100 text-teal-800",
  [DisputeState.ResolvedByAdmin]: "bg-indigo-100 text-indigo-700",
  [DisputeState.Closed]: "bg-zinc-100 text-zinc-600",
};

/** Punto de color usado como marcador de sección/estado. */
export const DISPUTE_STATE_DOT_CLASSES: Record<DisputeState, string> = {
  [DisputeState.OpenP2P]: "bg-sky-500",
  [DisputeState.Escalated]: "bg-amber-500",
  [DisputeState.ResolvedByP2P]: "bg-teal-500",
  [DisputeState.ResolvedByAdmin]: "bg-indigo-500",
  [DisputeState.Closed]: "bg-zinc-400",
};

/** Icono que identifica cada estado de disputa a simple vista. */
export const DISPUTE_STATE_ICONS: Record<DisputeState, LucideIcon> = {
  [DisputeState.OpenP2P]: Handshake,
  [DisputeState.Escalated]: ArrowUpCircle,
  [DisputeState.ResolvedByP2P]: CheckCircle2,
  [DisputeState.ResolvedByAdmin]: ShieldCheck,
  [DisputeState.Closed]: Archive,
};

/** Tinte de fondo del «chip» de estado (mantiene el mismo tono que el badge). */
export const DISPUTE_STATE_CHIP_CLASSES: Record<DisputeState, string> = {
  [DisputeState.OpenP2P]: "bg-sky-100 text-sky-700",
  [DisputeState.Escalated]: "bg-amber-100 text-amber-700",
  [DisputeState.ResolvedByP2P]: "bg-teal-100 text-teal-700",
  [DisputeState.ResolvedByAdmin]: "bg-indigo-100 text-indigo-600",
  [DisputeState.Closed]: "bg-zinc-100 text-zinc-500",
};

/** Badge del fallo de la plataforma, con la misma familia del sistema de reservas. */
export const DISPUTE_JUDGEMENT_BADGE_CLASSES: Record<DisputeJudgement, string> =
  {
    [DisputeJudgement.GuestFavored]: "bg-sky-100 text-sky-800",
    [DisputeJudgement.HostFavored]: "bg-emerald-100 text-emerald-800",
    [DisputeJudgement.NoFaultFound]: "bg-zinc-100 text-zinc-600",
    [DisputeJudgement.MaliciousClaim]: "bg-rose-100 text-rose-700",
  };

/** Punto de color del encabezado de cada sección (P2P vs escaladas). */
export const DISPUTE_KIND_DOT_CLASSES: Record<DisputeKind, string> = {
  escalated: "bg-primary",
  p2p: "bg-teal-500",
};

/** Etiquetas de severidad para el filtro (opciones del select). */
export const SEVERITY_OPTIONS: {
  value: PenaltySeverity;
  label: string;
}[] = [
  { value: PenaltySeverity.Low, label: "Baja" },
  { value: PenaltySeverity.Medium, label: "Media" },
  { value: PenaltySeverity.High, label: "Alta" },
];

/** Opciones del filtro de tipo de juicio, en el orden del enum. */
export const JUDGEMENT_OPTIONS: {
  value: DisputeJudgement;
  label: string;
}[] = [
  { value: DisputeJudgement.GuestFavored, label: "A favor del huésped" },
  { value: DisputeJudgement.HostFavored, label: "A favor del anfitrión" },
  { value: DisputeJudgement.NoFaultFound, label: "Sin culpas" },
  { value: DisputeJudgement.MaliciousClaim, label: "Reclamo malicioso" },
];
