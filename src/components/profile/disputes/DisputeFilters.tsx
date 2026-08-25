"use client";

import { RotateCcw } from "lucide-react";

import { PenaltySeverity } from "@GestLabs2-0/stayke-disputes";
import { DisputeJudgement } from "@/types/api/disputes";
import type {
  DisputeFiltersProps,
  DisputesFilterState,
} from "@/types/profile/disputes";
import { JUDGEMENT_OPTIONS, SEVERITY_OPTIONS } from "./disputeStatusStyles";

const selectBase =
  "w-full rounded-[10px] bg-[#EFF3F6] px-4 py-3 font-plus-jakarta text-[14px] font-semibold text-[#171717] focus-visible:outline-none focus-visible:shadow-[0_0_0_2px_rgba(59,0,127,0.4)] appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2216%22%20height%3D%2216%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%237C838F%22%20stroke-width%3D%222%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%2F%3E%3C%2Fsvg%3E')] bg-[length:16px] bg-[right_16px_center] bg-no-repeat pr-10";

const dateBase =
  "w-full rounded-[10px] bg-[#EFF3F6] px-4 py-3 font-plus-jakarta text-[14px] font-semibold text-[#171717] focus-visible:outline-none focus-visible:shadow-[0_0_0_2px_rgba(59,0,127,0.4)]";

const labelBase = "font-plus-jakarta text-[13px] font-semibold text-[#434654]";

type SeverityValue = PenaltySeverity | null;
type JudgementValue = DisputeJudgement | null;

function parseSeverity(raw: string): SeverityValue {
  if (raw === "") return null;
  const value = (PenaltySeverity as Record<string, unknown>)[raw];
  return typeof value === "number" ? (value as PenaltySeverity) : null;
}

function parseJudgement(raw: string): JudgementValue {
  if (raw === "") return null;
  const value = (DisputeJudgement as Record<string, unknown>)[raw];
  return typeof value === "number" ? (value as DisputeJudgement) : null;
}

function severityValue(value: SeverityValue): string {
  return value === null ? "" : PenaltySeverity[value];
}

function judgementValue(value: JudgementValue): string {
  return value === null ? "" : DisputeJudgement[value];
}

export function DisputeFilters({
  value,
  total,
  onChange,
  onClear,
}: DisputeFiltersProps) {
  const set = (patch: Partial<DisputesFilterState>) =>
    onChange({ ...value, ...patch });

  return (
    <div className="card-white space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="font-montserrat text-[15px] font-bold text-[#171717]">
          Filtrar disputas
          <span className="ml-2 font-sans text-sm font-semibold text-[#a0a5b5]">
            ({total})
          </span>
        </h3>
        <button
          type="button"
          onClick={onClear}
          className="cursor-pointer inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 font-plus-jakarta text-[13px] font-semibold text-[#3b007f] transition-colors hover:bg-[#3b007f]/5"
        >
          <RotateCcw className="size-4" />
          Limpiar
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div>
          <label htmlFor="filter-dispute-date" className={labelBase}>
            Fecha desde
          </label>
          <input
            id="filter-dispute-date"
            type="date"
            value={value.dateFrom}
            onChange={(e) => set({ dateFrom: e.target.value })}
            className={`${dateBase} mt-1.5`}
          />
        </div>

        <div>
          <label htmlFor="filter-dispute-severity" className={labelBase}>
            Severidad
          </label>
          <select
            id="filter-dispute-severity"
            className={`${selectBase} mt-1.5`}
            value={severityValue(value.severity)}
            onChange={(e) => set({ severity: parseSeverity(e.target.value) })}
          >
            <option value="">Todas</option>
            {SEVERITY_OPTIONS.map((option) => (
              <option key={option.value} value={PenaltySeverity[option.value]}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="filter-dispute-role" className={labelBase}>
            Rol
          </label>
          <select
            id="filter-dispute-role"
            className={`${selectBase} mt-1.5`}
            value={value.role ?? ""}
            onChange={(e) =>
              set({
                role:
                  e.target.value === ""
                    ? null
                    : (e.target.value as "initiator" | "accused"),
              })
            }
          >
            <option value="">Todos</option>
            <option value="initiator">Iniciador</option>
            <option value="accused">Acusado</option>
          </select>
        </div>

        <div>
          <label htmlFor="filter-dispute-judgement" className={labelBase}>
            Tipo de juicio
          </label>
          <select
            id="filter-dispute-judgement"
            className={`${selectBase} mt-1.5`}
            value={judgementValue(value.judgement)}
            onChange={(e) => set({ judgement: parseJudgement(e.target.value) })}
          >
            <option value="">Todos</option>
            {JUDGEMENT_OPTIONS.map((option) => (
              <option key={option.value} value={DisputeJudgement[option.value]}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="filter-dispute-type" className={labelBase}>
            Tipo de disputa
          </label>
          <select
            id="filter-dispute-type"
            className={`${selectBase} mt-1.5`}
            value={value.type ?? ""}
            onChange={(e) =>
              set({
                type:
                  e.target.value === ""
                    ? null
                    : (e.target.value as "escalated" | "p2p"),
              })
            }
          >
            <option value="">Todos</option>
            <option value="p2p">P2P</option>
            <option value="escalated">Escalada</option>
          </select>
        </div>
      </div>
    </div>
  );
}
