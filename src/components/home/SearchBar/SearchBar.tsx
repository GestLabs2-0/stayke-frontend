"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { CalendarIcon, LocationIcon, PersonIcon, SearchIcon } from "@/icons";
import type { GuestCounts } from "@/types/header";
import { SearchButton } from "./SearchButton";
import { SearchField } from "./SearchField";
import { SearchPanel } from "./SearchPanel";

export const SearchBar = () => {
  const router = useRouter();
  const [activeField, setActiveField] = useState<string | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<{
    name: string;
    lat: number;
    long: number;
  } | null>(null);

  const [guestCounts, setGuestCounts] = useState<GuestCounts>({
    adultos: 1,
    ninos: 0,
    bebes: 0,
    mascotas: 0,
  });

  const searchBarRef = useRef<HTMLDivElement>(null);

  // Close panel on click outside or escape key
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchBarRef.current &&
        !searchBarRef.current.contains(event.target as Node)
      ) {
        setActiveField(null);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setActiveField(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const handleSelectDestination = (dest: {
    name: string;
    lat: number;
    long: number;
  }) => {
    setSelectedLocation(dest);
    setActiveField("dates");
  };

  const handleAdjustGuest = (key: keyof GuestCounts, delta: number) => {
    setGuestCounts((prev) => ({
      ...prev,
      [key]: Math.max(0, prev[key] + delta),
    }));
  };

  const handleSearch = () => {
    const lat = selectedLocation?.lat ?? 10.4806;
    const long = selectedLocation?.long ?? -66.9036;
    const minGuests = guestCounts.adultos > 0 ? guestCounts.adultos : 1;

    const searchParams = new URLSearchParams({
      lat: String(lat),
      long: String(long),
      minGuests: String(minGuests),
    });

    if (selectedLocation?.name) {
      searchParams.set("location", selectedLocation.name);
    }

    setActiveField(null);
    router.push(`/destinies?${searchParams.toString()}`);
  };

  const guestLabel = (() => {
    const total = guestCounts.adultos + guestCounts.ninos;
    if (total === 0) return "¿Cuántos?";
    return `${total} huésped${total > 1 ? "es" : ""}`;
  })();

  return (
    <div ref={searchBarRef} className="relative w-full max-w-4xl mx-auto">
      {/* ─── Desktop SearchBar (≥ 980px) ─── */}
      <div className="hidden min-[980px]:flex items-center bg-white rounded-full shadow-[0_16px_36px_rgba(0,0,0,0.18)] border border-zinc-200/90 divide-x divide-zinc-200/80 overflow-hidden hover:shadow-[0_20px_48px_rgba(0,0,0,0.22)] transition-shadow duration-200">
        <SearchField
          label="¿A dónde vas?"
          placeholder={
            selectedLocation ? selectedLocation.name : "Explora destinos"
          }
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
          placeholder={guestLabel}
          isActive={activeField === "guest"}
          onClick={() =>
            setActiveField(activeField === "guest" ? null : "guest")
          }
        >
          <PersonIcon />
        </SearchField>
        <SearchButton onClick={handleSearch} />
      </div>

      {/* ─── Mobile / Tablet SearchCard (< 980px) ─── */}
      <div className="flex min-[980px]:hidden flex-col w-full max-w-md mx-auto bg-white rounded-3xl p-3 sm:p-4 shadow-[0_16px_36px_rgba(0,0,0,0.24)] border border-white/60 backdrop-blur-md gap-2">
        {/* Row 1: Destino */}
        <button
          type="button"
          onClick={() =>
            setActiveField(activeField === "destination" ? null : "destination")
          }
          className={`w-full flex items-center gap-3 px-3.5 py-2.5 sm:py-3 rounded-2xl transition-all duration-150 text-left border cursor-pointer ${
            activeField === "destination"
              ? "bg-purple-50/80 border-purple-300 ring-2 ring-purple-600/20"
              : "bg-zinc-50/90 hover:bg-zinc-100/90 border-zinc-200/60"
          }`}
        >
          <div className="w-8 h-8 rounded-full bg-purple-100 text-[#3b007f] flex items-center justify-center shrink-0">
            <div className="w-4 h-4">
              <LocationIcon />
            </div>
          </div>
          <div className="flex flex-col min-w-0 flex-1">
            <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider leading-none mb-1">
              ¿A dónde vas?
            </span>
            <span className="text-sm font-semibold text-zinc-900 truncate">
              {selectedLocation ? selectedLocation.name : "Explora destinos"}
            </span>
          </div>
        </button>

        {/* Row 2: Fechas */}
        <button
          type="button"
          onClick={() =>
            setActiveField(activeField === "dates" ? null : "dates")
          }
          className={`w-full flex items-center gap-3 px-3.5 py-2.5 sm:py-3 rounded-2xl transition-all duration-150 text-left border cursor-pointer ${
            activeField === "dates"
              ? "bg-purple-50/80 border-purple-300 ring-2 ring-purple-600/20"
              : "bg-zinc-50/90 hover:bg-zinc-100/90 border-zinc-200/60"
          }`}
        >
          <div className="w-8 h-8 rounded-full bg-purple-100 text-[#3b007f] flex items-center justify-center shrink-0">
            <div className="w-4 h-4">
              <CalendarIcon />
            </div>
          </div>
          <div className="flex flex-col min-w-0 flex-1">
            <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider leading-none mb-1">
              Fechas
            </span>
            <span className="text-sm font-semibold text-zinc-900 truncate">
              Agrega fechas
            </span>
          </div>
        </button>

        {/* Row 3: Huéspedes */}
        <button
          type="button"
          onClick={() =>
            setActiveField(activeField === "guest" ? null : "guest")
          }
          className={`w-full flex items-center gap-3 px-3.5 py-2.5 sm:py-3 rounded-2xl transition-all duration-150 text-left border cursor-pointer ${
            activeField === "guest"
              ? "bg-purple-50/80 border-purple-300 ring-2 ring-purple-600/20"
              : "bg-zinc-50/90 hover:bg-zinc-100/90 border-zinc-200/60"
          }`}
        >
          <div className="w-8 h-8 rounded-full bg-purple-100 text-[#3b007f] flex items-center justify-center shrink-0">
            <div className="w-4 h-4">
              <PersonIcon />
            </div>
          </div>
          <div className="flex flex-col min-w-0 flex-1">
            <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider leading-none mb-1">
              Huéspedes
            </span>
            <span className="text-sm font-semibold text-zinc-900 truncate">
              {guestLabel}
            </span>
          </div>
        </button>

        {/* Mobile Search CTA */}
        <button
          type="button"
          onClick={handleSearch}
          aria-label="Buscar alojamientos"
          className="w-full bg-[#3b007f] hover:bg-[#5307ad] active:scale-[0.98] text-white font-montserrat font-bold text-sm sm:text-base py-3.5 px-6 rounded-2xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2.5 cursor-pointer mt-1"
        >
          <SearchIcon />
          <span>Buscar alojamientos</span>
        </button>
      </div>

      {/* ─── Search Panels (Desktop dropdown & Mobile sheet) ─── */}
      <SearchPanel
        activeField={activeField}
        onSelectDestination={handleSelectDestination}
        guestCounts={guestCounts}
        onAdjustGuest={handleAdjustGuest}
        onClose={() => setActiveField(null)}
      />
    </div>
  );
};
