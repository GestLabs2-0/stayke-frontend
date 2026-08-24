"use client";

import { Scale } from "lucide-react";
import { useMemo, useState } from "react";

import { Breadcrumb } from "@/components/profile/Breadcrumb";
import { DisputeFilters } from "@/components/profile/disputes/DisputeFilters";
import { DisputeList } from "@/components/profile/disputes/DisputeList";
import { DisputeSection } from "@/components/profile/disputes/DisputeSection";
import { useUserDisputes } from "@/hooks/useUserDisputes";
import { useWalletContext } from "@/hooks/useWallet";
import { disputeKind } from "@/types/api/disputes";
import type { DisputesFilterState } from "@/types/profile/disputes";
import {
  disputesFiltersActive,
  EMPTY_DISPUTES_FILTERS,
} from "@/types/profile/disputes";

export default function DisputesPage() {
  const { userWallet } = useWalletContext();
  const [filters, setFilters] = useState<DisputesFilterState>(
    EMPTY_DISPUTES_FILTERS,
  );

  const { disputes, loading } = useUserDisputes(userWallet, {
    severity: filters.severity,
    judgement: filters.judgement,
    role: filters.role,
    dateFrom: filters.dateFrom,
  });

  const filtersActive = disputesFiltersActive(filters);

  const escalated = useMemo(
    () => disputes.filter((dispute) => disputeKind(dispute) === "escalated"),
    [disputes],
  );
  const p2p = useMemo(
    () => disputes.filter((dispute) => disputeKind(dispute) === "p2p"),
    [disputes],
  );
  const filtered = useMemo(
    () =>
      filters.type
        ? disputes.filter((dispute) => disputeKind(dispute) === filters.type)
        : disputes,
    [disputes, filters.type],
  );

  const visibleTotal = filtersActive ? filtered.length : disputes.length;

  return (
    <div className="space-y-6">
      <Breadcrumb />

      <div className="flex flex-wrap items-center gap-3">
        <span className="flex size-10 items-center justify-center rounded-xl bg-primary/10">
          <Scale className="size-5 text-primary" />
        </span>
        <div>
          <h1 className="font-montserrat text-[22px] font-bold text-[#171717]">
            Mis disputas
          </h1>
          <p className="font-sans text-sm text-[#434654]">
            Seguí el estado de tus disputas y su resolución.
          </p>
        </div>
      </div>

      <DisputeFilters
        value={filters}
        total={visibleTotal}
        onChange={setFilters}
        onClear={() => setFilters(EMPTY_DISPUTES_FILTERS)}
      />

      {filtersActive ? (
        <DisputeList
          disputes={filtered}
          userWallet={userWallet}
          loading={loading}
          emptyMessage="No se encontraron disputas con estos filtros."
          emptyDescription="Probá ajustar o limpiar los filtros para ver más resultados."
        />
      ) : (
        <div className="space-y-8">
          <DisputeSection
            kind="escalated"
            title="Disputas escaladas"
            description="Necesitaron la intervención de Stayke para resolverse."
            disputes={escalated}
            userWallet={userWallet}
            loading={loading}
            emptyMessage="No tenés disputas escaladas."
            emptyDescription="Cuando las partes no llegan a un acuerdo, la disputa sube a Stayke y se resuelve con un fallo."
          />
          <DisputeSection
            kind="p2p"
            title="Disputas P2P"
            description="Se resuelven directamente entre las partes, sin intervención de la plataforma."
            disputes={p2p}
            userWallet={userWallet}
            loading={loading}
            emptyMessage="No tenés disputas P2P."
            emptyDescription="Las disputas P2P se resuelven entre las partes, como acordaron al iniciarlas."
          />
        </div>
      )}
    </div>
  );
}
