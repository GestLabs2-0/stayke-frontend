interface DestinyPaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  onPageChange: (page: number) => void;
}

export function DestinyPagination({
  currentPage,
  totalPages,
  totalItems,
  onPageChange,
}: DestinyPaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="mt-6 flex flex-col gap-2 border-t border-zinc-200 pt-4">
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="inline-flex items-center gap-1 rounded-xl border border-zinc-300 bg-white px-3 py-1.5 text-xs font-bold text-zinc-700 transition-all hover:bg-zinc-50 hover:border-zinc-400 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
        >
          ← Anterior
        </button>

        <div className="flex items-center gap-1">
          {Array.from({ length: totalPages }).map((_, i) => {
            const pageNum = i + 1;
            const isCurrent = pageNum === currentPage;
            return (
              <button
                key={`page-${pageNum}`}
                type="button"
                onClick={() => onPageChange(pageNum)}
                className={`flex size-7 items-center justify-center rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  isCurrent
                    ? "bg-purple-600 text-white shadow-xs"
                    : "text-zinc-600 hover:bg-zinc-100"
                }`}
              >
                {pageNum}
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="inline-flex items-center gap-1 rounded-xl border border-zinc-300 bg-white px-3 py-1.5 text-xs font-bold text-zinc-700 transition-all hover:bg-zinc-50 hover:border-zinc-400 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
        >
          Siguiente →
        </button>
      </div>

      <p className="text-center text-[11px] font-medium text-zinc-400">
        Página {currentPage} de {totalPages} ({totalItems} resultados)
      </p>
    </div>
  );
}
