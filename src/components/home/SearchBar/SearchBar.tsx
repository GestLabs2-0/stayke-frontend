"use client";

import { useState } from "react";

import { CalendarIcon, LocationIcon, PersonIcon } from "@/icons";
import { SearchButton } from "./SearchButton";
import { SearchField } from "./SearchField";
import { SearchPanel } from "./SearchPanel";

export const SearchBar = () => {
  const [activeField, setActiveField] = useState<string | null>(null);
  return (
    <div className="relative">
      <div className="flex items-center bg-white rounded-full shadow-lg border border-zinc-200 divide-x divide-zinc-200 overflow-hidden">
        <SearchField
          label="¿A dónde vas?"
          placeholder="Explora destinos"
          isActive={activeField === "destination"}
          onClick={() =>
            setActiveField(activeField === "destination" ? null : "destination")
          }
        >
          <LocationIcon />
        </SearchField>
        <SearchField
          label="Fechas"
          placeholder="Agrega fechas"
          isActive={activeField === "dates"}
          onClick={() =>
            setActiveField(activeField === "dates" ? null : "dates")
          }
        >
          <CalendarIcon />
        </SearchField>
        <SearchField
          label="Huéspedes"
          placeholder="¿Cuántos?"
          isActive={activeField === "guest"}
          onClick={() =>
            setActiveField(activeField === "guest" ? null : "guest")
          }
        >
          <PersonIcon />
        </SearchField>
        <SearchButton />
      </div>
      <SearchPanel activeField={activeField} />
    </div>
  );
};
