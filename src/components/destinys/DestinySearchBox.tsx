"use client";

import { useEffect, useRef, useState } from "react";

import { LocationIcon, SearchIcon, XIcon } from "@/icons";
import type { Locations } from "@/lib/locationsApi";
import { searchByLocation } from "@/lib/locationsApi";

interface DestinySearchBoxProps {
  initialValue?: string;
  onSelectLocation: (location: {
    name: string;
    lat: number;
    lng: number;
  }) => void;
  placeholder?: string;
}

export function DestinySearchBox({
  initialValue = "",
  onSelectLocation,
  placeholder = "Buscar ubicación o ciudad...",
}: DestinySearchBoxProps) {
  const [query, setQuery] = useState(initialValue);
  const [results, setResults] = useState<Locations[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setQuery(initialValue);
  }, [initialValue]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: globalThis.MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleChange = (value: string) => {
    setQuery(value);
    if (!value.trim()) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    setIsSearching(true);
    setIsOpen(true);

    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(async () => {
      try {
        const data = await searchByLocation(value, 5);
        setResults(data);
      } catch {
        setResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 300);
  };

  const handleSelect = (loc: Locations) => {
    const name = loc.name || loc.display_name.split(",")[0] || loc.display_name;
    const lat = parseFloat(loc.lat);
    const lng = parseFloat(loc.lon);

    setQuery(name);
    setIsOpen(false);

    if (!Number.isNaN(lat) && !Number.isNaN(lng)) {
      onSelectLocation({ name, lat, lng });
    }
  };

  const handleClear = () => {
    setQuery("");
    setResults([]);
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className="relative z-30 w-full">
      <div className="relative flex items-center">
        <input
          type="text"
          value={query}
          onChange={(e) => handleChange(e.target.value)}
          onFocus={() => {
            if (query.trim() && results.length > 0) {
              setIsOpen(true);
            }
          }}
          placeholder={placeholder}
          className="w-full pl-10 pr-10 py-3 bg-white border border-zinc-200 rounded-2xl text-sm font-medium text-zinc-900 placeholder:text-zinc-400 shadow-xs focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition-all"
        />
        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-600 pointer-events-none">
          <SearchIcon />
        </div>
        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 transition-colors cursor-pointer"
            aria-label="Limpiar búsqueda"
          >
            <XIcon className="size-4" />
          </button>
        )}
      </div>

      {/* Suggestions Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1.5 bg-white rounded-2xl border border-zinc-200 shadow-xl p-2 z-50 max-h-60 overflow-y-auto">
          {isSearching ? (
            <div className="flex items-center justify-center py-4 gap-2 text-zinc-500 text-xs font-medium">
              <span className="size-3.5 animate-spin rounded-full border-2 border-purple-300 border-t-purple-600" />
              <span>Buscando lugares...</span>
            </div>
          ) : results.length === 0 ? (
            <p className="text-xs text-zinc-400 py-3 text-center">
              No encontramos resultados
            </p>
          ) : (
            results.map((item) => (
              <button
                type="button"
                key={item.place_id}
                onClick={() => handleSelect(item)}
                className="w-full text-left flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-zinc-800 hover:bg-purple-50 hover:text-purple-950 transition-colors cursor-pointer"
              >
                <div className="w-4 h-4 text-purple-600 shrink-0">
                  <LocationIcon />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-zinc-900 truncate">
                    {item.name || item.display_name.split(",")[0]}
                  </p>
                  <p className="text-[11px] text-zinc-500 truncate">
                    {item.display_name}
                  </p>
                </div>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}
