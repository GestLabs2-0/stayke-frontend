"use client";

import { useState } from "react";
import { IconFilter } from "@/components/Icons/IconFilter";
import type { FilterKey } from "@/types/FilterBar";
import { filters } from "./mocks/filters";

export const FilterBar = () => {
  const [selected, setSelected] = useState<FilterKey | null>(null);

  return (
    <div className="container mx-auto px-4">
      <div className="flex items-center justify-between border-b border-[#C3C6D6] pb-4">
        <div className="flex items-center gap-6">
          {filters.map(({ key, icon: Icon, label }) => {
            const isSelected = selected === key;
            const fillColor = isSelected ? "#191C1E" : "#A0A5B5";

            return (
              <button
                type="button"
                key={key}
                onClick={() => setSelected(isSelected ? null : key)}
                className="flex flex-col items-center gap-1 cursor-pointer transition-all duration-200 hover:scale-110 hover:-translate-y-1"
              >
                <span style={{ color: fillColor }}>
                  <Icon size={22} className="[&_path]:fill-current" />
                </span>
                <span
                  className="text-[11px] font-medium leading-tight"
                  style={{ color: fillColor }}
                >
                  {label}
                </span>
              </button>
            );
          })}
        </div>

        <button
          type="button"
          className="flex items-center gap-2 rounded-md border p-2.5 cursor-pointer border-[#C3C6D6] transition-all duration-200 hover:scale-105 hover:shadow-sm"
        >
          <IconFilter size={20} />
          <span className="text-sm font-medium text-[#434654]">Filtros</span>
        </button>
      </div>
    </div>
  );
};
