import React from "react";
import type { EscapadasCercaProps } from "@/types/escapadas-cerca";
import { FilterBar } from "../FilterBar/FilterBar";
import { GridCards } from "./GridCards";

export const EscapadasCerca = ({
  properties,
  periodLabel = "Se muestran ofertas para este periodo",
}: EscapadasCercaProps) => {
  if (properties.length === 0) return <React.Fragment />;

  return (
    <section className="w-full max-w-400 mx-auto py-12 px-40 max-[1210px]:px-16.5">
      <FilterBar />

      {/* Encabezado */}
      <div className="mb-6 ml-13 max-[1025px]:ml-0 flex flex-col gap-1">
        <h2 className="text-3xl font-semibold text-zinc-900 tracking-tight">
          Escapadas cerca de tu ubicación
        </h2>
        <p className="text-base text-zinc-500">{periodLabel}</p>
      </div>

      <GridCards properties={properties} />
    </section>
  );
};
