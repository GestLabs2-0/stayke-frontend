interface DestinyResultsHeaderProps {
  title?: string;
  totalItems: number;
  isLoading: boolean;
}

export function DestinyResultsHeader({
  title = "Alojamientos en esta zona",
  totalItems,
  isLoading,
}: DestinyResultsHeaderProps) {
  const countLabel = (() => {
    if (isLoading) return "Buscando...";
    return `${totalItems} ${totalItems === 1 ? "propiedad" : "propiedades"}`;
  })();

  return (
    <div className="flex items-center justify-between pb-1 border-b border-zinc-100">
      <h1 className="text-lg font-bold text-zinc-950">{title}</h1>
      <p className="text-xs font-semibold text-zinc-500">{countLabel}</p>
    </div>
  );
}
