"use client";

import { BlossomCarousel } from "@blossom-carousel/react";
import { useState } from "react";

import { IconFilter } from "@/icons/IconFilter";
import type { FilterKey } from "@/types/FilterBar";
import { FilterCategoryButton } from "./FilterCategoryButton";
import { filters } from "./mocks/filters";

export const FilterBar = () => {
  const [selected, setSelected] = useState<FilterKey | null>(null);

  return (
    <div className="container mx-auto px-4 pb-12">
      <div className="flex items-center justify-between border-b border-[#C3C6D6] pb-4 gap-4">
        {/* Desktop */}
        <div className="hidden md:flex items-center gap-6">
          {filters.map(({ key, icon, label }) => (
            <FilterCategoryButton
              key={key}
              icon={icon}
              label={label}
              isSelected={selected === key}
              onClick={() => setSelected(selected === key ? null : key)}
            />
          ))}
        </div>

        {/* Mobile */}
        <div className="md:hidden flex-1 min-w-0 relative">
          <BlossomCarousel load="conditional">
            {filters.map(({ key, icon, label }) => (
              <span key={key} className="inline-block mx-2 first:ml-0">
                <FilterCategoryButton
                  icon={icon}
                  label={label}
                  isSelected={selected === key}
                  onClick={() => setSelected(selected === key ? null : key)}
                />
              </span>
            ))}
          </BlossomCarousel>
        </div>

        <button
          type="button"
          className="rounded-full p-2.5 md:rounded-md md:px-4 md:py-2.5 md:flex md:items-center md:gap-2 cursor-pointer border border-[#C3C6D6] transition-all duration-200 hover:scale-105 hover:shadow-sm shrink-0"
        >
          <IconFilter size={20} />
          <span className="hidden md:inline text-sm font-medium text-[#434654]">
            Filtros
          </span>
        </button>
      </div>
    </div>
  );
};
