"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import type { PenaltySeverity } from "@GestLabs2-0/stayke-disputes";
import { staykeApi } from "@/lib/staykeApi";
import type {
  Dispute,
  DisputeJudgement,
  DisputeRoleFilter,
} from "@/types/api/disputes";

export interface UseUserDisputesFilters {
  severity: PenaltySeverity | null;
  judgement: DisputeJudgement | null;
  /** null = disputas como iniciador y como acusado (dos fetches mergeados). */
  role: DisputeRoleFilter | null;
  /** Fecha "desde" (YYYY-MM-DD) aplicada en el backend. */
  dateFrom: string;
}

/** Tamaño de página del fetch contra el backend. */
const FETCH_PAGE_SIZE = 100;
/** Cota de seguridad: como mucho 10 páginas (1000 disputas) por scope. */
const MAX_PAGES = 10;

/**
 * Trae TODAS las disputas del usuario autenticado (rol iniciador, acusado o
 * ambos) paginando contra el backend en bloques de 100 y mergeando el resultado.
 *
 * Los filtros de severidad, juicio, rol y fecha se envían al backend; el tipo
 * (escalada/p2p) se deriva en el cliente porque agrupa varios estados.
 */
export function useUserDisputes(
  wallet: string | null | undefined,
  { severity, judgement, role, dateFrom }: UseUserDisputesFilters,
) {
  const [disputes, setDisputes] = useState<Dispute[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  const refresh = useCallback(() => setRefreshKey((key) => key + 1), []);

  useEffect(() => {
    let cancelled = false;
    // refreshKey fuerza un re-run tras un refresh manual (mismo patrón que bookings).
    void refreshKey;

    if (!wallet) {
      setDisputes([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    // Scopes: un fetch por rol; sin filtro de rol se consultan ambos y se mezclan.
    const scopes: { initiator?: string; accused?: string }[] =
      role === "initiator"
        ? [{ initiator: wallet }]
        : role === "accused"
          ? [{ accused: wallet }]
          : [{ initiator: wallet }, { accused: wallet }];

    const fetchAll = async () => {
      const merged = new Map<string, Dispute>();

      for (const scope of scopes) {
        for (let page = 0; page < MAX_PAGES; page++) {
          const result = await staykeApi.getDisputes({
            ...scope,
            severity: severity ?? undefined,
            judgement: judgement ?? undefined,
            initiatedAtDate: dateFrom || undefined,
            limit: FETCH_PAGE_SIZE,
            offset: page * FETCH_PAGE_SIZE,
          });

          const items =
            result.status && Array.isArray(result.data) ? result.data : [];
          for (const dispute of items) {
            merged.set(dispute.disputePda, dispute);
          }

          const total = result.meta?.total ?? items.length;
          const remaining = total - (page + 1) * FETCH_PAGE_SIZE;
          if (remaining <= 0 || items.length < FETCH_PAGE_SIZE) break;
        }
      }

      return [...merged.values()].sort((a, b) => b.openedAt - a.openedAt);
    };

    fetchAll()
      .then((result) => {
        if (cancelled) return;
        setDisputes(result);
        setLoading(false);
      })
      .catch(() => {
        if (cancelled) return;
        setDisputes([]);
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [wallet, severity, judgement, role, dateFrom, refreshKey]);

  return useMemo(
    () => ({ disputes, loading, refresh }),
    [disputes, loading, refresh],
  );
}
