"use client";

import { RotateCcw } from "lucide-react";

import { FormInput } from "@/components/profile/properties/FormInput";
import type { HostPropertyFiltersProps } from "@/types/property/HostProperties";
import type { PropertyStatusFilter } from "@/types/property/propertyFilters";

const selectBase =
  "w-full rounded-[10px] bg-[#EFF3F6] px-4 py-3 font-plus-jakarta text-[14px] font-semibold text-[#171717] focus-visible:outline-none focus-visible:shadow-[0_0_0_2px_rgba(59,0,127,0.4)] appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2216%22%20height%3D%2216%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%237C838F%22%20stroke-width%3D%222%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%2F%3E%3C%2Fsvg%3E')] bg-[length:16px] bg-[right_16px_center] bg-no-repeat pr-10";

const STATUS_OPTIONS: { value: PropertyStatusFilter; label: string }[] = [
  { value: "all", label: "Todas" },
  { value: "active", label: "Activas" },
  { value: "inactive", label: "Inactivas" },
];

export function HostPropertyFilters({
  values,
  onChange,
  onReset,
  resultCount,
  totalCount,
}: HostPropertyFiltersProps) {
  return (
    <div className="card-white space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-montserrat text-[15px] font-bold text-[#171717]">
          Filtrar propiedades
        </h2>
        <div className="flex items-center gap-3">
          <span className="font-sans text-[13px] text-[#a0a5b5]">
            {resultCount} de {totalCount}
          </span>
          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 font-plus-jakarta text-[13px] font-semibold text-[#3b007f] transition-colors hover:bg-[#3b007f]/5"
          >
            <RotateCcw className="size-4" />
            Limpiar
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <FormInput
          id="filter-name"
          label="Nombre"
          placeholder="Buscar por nombre"
          value={values.name}
          onChange={(e) => onChange("name", e.target.value)}
        />
        <FormInput
          id="filter-address"
          label="Dirección"
          placeholder="Buscar por dirección"
          value={values.address}
          onChange={(e) => onChange("address", e.target.value)}
        />
        <FormInput
          id="filter-reviews"
          label="Reseñas (mínimo)"
          type="number"
          min={0}
          value={values.reviewsFrom || ""}
          onChange={(e) => onChange("reviewsFrom", Number(e.target.value))}
        />
        <FormInput
          id="filter-price"
          label="Precio máximo"
          type="number"
          min={0}
          prefix="$"
          value={values.priceUpTo || ""}
          onChange={(e) => onChange("priceUpTo", Number(e.target.value))}
        />
        <div className="space-y-1.5">
          <label
            htmlFor="filter-status"
            className="font-plus-jakarta text-[13px] font-semibold text-[#434654]"
          >
            Estado
          </label>
          <select
            id="filter-status"
            className={selectBase}
            value={values.status}
            onChange={(e) =>
              onChange("status", e.target.value as PropertyStatusFilter)
            }
          >
            {STATUS_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
