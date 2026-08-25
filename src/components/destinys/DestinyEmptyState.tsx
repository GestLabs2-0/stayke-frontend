import { LocationIcon } from "@/icons";

interface DestinyEmptyStateProps {
  title?: string;
  description?: string;
}

export function DestinyEmptyState({
  title = "No hay propiedades en esta área del mapa",
  description = "Mueve o aleja el mapa para explorar alojamientos disponibles en otras ubicaciones.",
}: DestinyEmptyStateProps) {
  return (
    <div className="flex min-h-[35vh] flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-300 p-6 text-center bg-zinc-50/70">
      <div className="flex size-12 items-center justify-center rounded-full bg-purple-100 text-purple-600 mb-3 p-3">
        <LocationIcon />
      </div>
      <h3 className="text-sm font-bold text-zinc-900">{title}</h3>
      <p className="mt-1 text-xs text-zinc-500 max-w-xs">{description}</p>
    </div>
  );
}
