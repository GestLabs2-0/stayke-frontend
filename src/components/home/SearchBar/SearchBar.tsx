"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { CalendarIcon, LocationIcon, PersonIcon } from "@/icons";
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

  // Close panel on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchBarRef.current &&
        !searchBarRef.current.contains(event.target as Node)
      ) {
        setActiveField(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
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
    <div ref={searchBarRef} className="relative">
      <div className="flex items-center bg-white rounded-full shadow-lg border border-zinc-200 divide-x divide-zinc-200 overflow-hidden">
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
      <SearchPanel
        activeField={activeField}
        onSelectDestination={handleSelectDestination}
        guestCounts={guestCounts}
        onAdjustGuest={handleAdjustGuest}
      />
    </div>
  );
};
