"use client";

import { useEffect, useRef, useState } from "react";

import { LocationIcon, SearchIcon } from "@/icons";
import type { Locations } from "@/lib/locationsApi";
import { searchByLocation } from "@/lib/locationsApi";
import type { DestinationMenuProps } from "@/types/header";
import { destinosData } from "./mocks";

const DESTINO_COORDS: Record<string, { lat: number; long: number }> = {
  Caracas: { lat: 10.4806, long: -66.9036 },
  "Madrid, España": { lat: 40.4168, long: -3.7038 },
  "Cúcuta, Colombia": { lat: 7.8939, long: -72.5078 },
  Lecherías: { lat: 10.1884, long: -64.6908 },
  "Barquisimeto, Lara": { lat: 10.0647, long: -69.357 },
};

export const DestinationMenu = ({
  onSelectDestination,
}: DestinationMenuProps) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Locations[]>([]);
  const [loading, setLoading] = useState(false);
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);

    debounceTimerRef.current = setTimeout(async () => {
      try {
        const data = await searchByLocation(query);
        setResults(data);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 350);

    return () => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    };
  }, [query]);

  const handleSelectSuggested = (ciudad: string) => {
    const coords = DESTINO_COORDS[ciudad] ?? { lat: 10.4806, long: -66.9036 };
    onSelectDestination?.({
      name: ciudad,
      lat: coords.lat,
      long: coords.long,
    });
  };

  const handleSelectResult = (item: Locations) => {
    const name =
      item.name || item.display_name.split(",")[0] || item.display_name;
    onSelectDestination?.({
      name,
      lat: parseFloat(item.lat),
      long: parseFloat(item.lon),
    });
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar ciudad, región o país..."
          className="w-full pl-9 pr-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
        />
        <div className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none">
          <SearchIcon />
        </div>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-6 gap-2 text-zinc-500 text-sm">
          <span className="size-4 animate-spin rounded-full border-2 border-purple-300 border-t-purple-600" />
          <span>Buscando ubicaciones...</span>
        </div>
      )}

      {!loading && query.trim() !== "" && (
        <div>
          <p className="text-xs font-semibold text-zinc-500 mb-2">
            Resultados de búsqueda
          </p>
          {results.length === 0 ? (
            <p className="text-sm text-zinc-400 py-3 text-center">
              No se encontraron lugares
            </p>
          ) : (
            <div className="max-h-64 overflow-y-auto space-y-1 pr-1">
              {results.map((item) => (
                <button
                  type="button"
                  key={item.place_id}
                  onClick={() => handleSelectResult(item)}
                  className="w-full text-left group flex items-start gap-3 cursor-pointer rounded-xl px-2 py-2.5 transition-colors duration-150 hover:bg-zinc-50"
                >
                  <div className="w-8 h-8 bg-purple-100 rounded-xl flex items-center justify-center transition-all duration-150 group-hover:bg-purple-200 shrink-0 mt-0.5">
                    <div className="w-4 h-4 text-purple-600">
                      <LocationIcon />
                    </div>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-zinc-900 truncate">
                      {item.name || item.display_name.split(",")[0]}
                    </p>
                    <p className="text-xs text-zinc-500 line-clamp-1">
                      {item.display_name}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {(!query.trim() || (!loading && results.length === 0)) && (
        <div>
          <p className="text-xs font-semibold text-zinc-500 mb-3">
            Destinos sugeridos
          </p>
          <div className="space-y-1">
            {destinosData.map((destino) => (
              <button
                type="button"
                key={destino.ciudad}
                onClick={() => handleSelectSuggested(destino.ciudad)}
                className="w-full text-left group flex items-center gap-3 cursor-pointer rounded-xl px-2 py-2.5 transition-colors duration-150 hover:bg-zinc-50"
              >
                <div className="w-8 h-8 bg-purple-100 rounded-xl flex items-center justify-center transition-all duration-150 group-hover:bg-purple-200 shrink-0">
                  <div className="w-5 h-5 text-purple-500 shrink-0">
                    <destino.icon />
                  </div>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-zinc-800">
                    {destino.ciudad}
                  </p>
                  <p className="text-xs text-zinc-500 truncate">
                    {destino.descripcion}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
