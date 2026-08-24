"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

import type { HostPropertyPaginationProps } from "@/types/property/HostProperties";

export function HostPropertyPagination({
  pageIndex,
  pages,
  loading,
  onPrevious,
  onNext,
}: HostPropertyPaginationProps) {
  if (pages <= 1) return null;

  const isFirstPage = pageIndex <= 1;
  const isLastPage = pageIndex >= pages;
  const isDisabled = loading;

  return (
    <nav
      aria-label="Paginación de propiedades"
      className="flex flex-wrap items-center justify-center gap-3 border-t border-border pt-4 sm:gap-4"
    >
      <button
        type="button"
        onClick={onPrevious}
        disabled={isFirstPage || isDisabled}
        aria-label="Página anterior"
        className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-border bg-white px-4 py-2 font-plus-jakarta text-[14px] font-semibold text-secondary transition-colors duration-200 hover:bg-surface disabled:cursor-not-allowed disabled:border-border/60 disabled:text-muted disabled:hover:bg-white"
      >
        <ChevronLeft className="size-4 shrink-0" aria-hidden="true" />
        Anterior
      </button>

      <p aria-live="polite" className="font-sans text-sm text-secondary">
        Página <span className="font-semibold">{pageIndex}</span> de {pages}
      </p>

      <button
        type="button"
        onClick={onNext}
        disabled={isLastPage || isDisabled}
        aria-label="Página siguiente"
        className="inline-flex cursor-pointer items-center gap-1.5 rounded-full bg-primary px-5 py-2 font-plus-jakarta text-[14px] font-semibold text-white transition-colors duration-200 hover:bg-primary-hover disabled:cursor-not-allowed disabled:bg-primary/40 disabled:text-white/70 disabled:hover:bg-primary/40"
      >
        Siguiente
        <ChevronRight className="size-4 shrink-0" aria-hidden="true" />
      </button>
    </nav>
  );
}
