"use client";

import { useRef, useState } from "react";

import type { DisputeListProps } from "@/types/profile/disputes";
import { EmptyState } from "../EmptyState";
import { DisputeCard } from "./DisputeCard";
import { DisputeListSkeleton } from "./DisputeListSkeleton";

const PAGE_BUTTON =
  "inline-flex cursor-pointer items-center justify-center rounded-full border border-primary/20 bg-primary/5 px-5 py-2 font-plus-jakarta text-[13px] font-semibold text-primary transition-colors hover:bg-primary/10 disabled:cursor-not-allowed disabled:opacity-40";

/**
 * Lista de disputas con paginación client-side (8 por página). Muestra las
 * tarjetas con entrada escalonada y oculta los controles si no hay más de una
 * página. Cada instancia maneja su propio estado de página.
 */
export function DisputeList({
  disputes,
  userWallet,
  loading = false,
  pageSize = 8,
  emptyMessage = "No hay disputas en esta sección.",
  emptyDescription,
}: DisputeListProps) {
  const [page, setPage] = useState(1);

  // Al cambiar el conjunto de datos (filtros, refresh) se vuelve a la página 1.
  // Se hace en render (patrón de estado derivado) para no depender de efectos.
  const seenDisputes = useRef(disputes);
  if (seenDisputes.current !== disputes) {
    seenDisputes.current = disputes;
    setPage(1);
  }

  const totalPages = Math.max(1, Math.ceil(disputes.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const visible = disputes.slice(
    (safePage - 1) * pageSize,
    safePage * pageSize,
  );

  if (loading && disputes.length === 0) {
    return <DisputeListSkeleton count={pageSize} />;
  }

  if (disputes.length === 0) {
    return <EmptyState message={emptyMessage} description={emptyDescription} />;
  }

  return (
    <div className="space-y-3">
      <div className="list-stagger space-y-3">
        {visible.map((dispute, i) => (
          <div
            key={dispute.disputePda}
            style={{ animationDelay: `${i * 40}ms` }}
          >
            <DisputeCard dispute={dispute} userWallet={userWallet} />
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={safePage <= 1}
            className={PAGE_BUTTON}
          >
            Anterior
          </button>
          <span className="font-sans text-sm font-semibold text-secondary">
            Página {safePage} de {totalPages}
          </span>
          <button
            type="button"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={safePage >= totalPages}
            className={PAGE_BUTTON}
          >
            Siguiente
          </button>
        </div>
      )}
    </div>
  );
}
