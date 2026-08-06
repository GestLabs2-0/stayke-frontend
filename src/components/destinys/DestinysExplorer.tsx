"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import type { DestinyPlace } from "@/types/destinys";
import { DestinyMap } from "./DestinyMap";
import { DestinyPlaceCard } from "./DestinyPlaceCard";
import { DestinySearchHero } from "./DestinySearchHero";
import { destinyPlacesData } from "./mocks";

const LOADING_DELAY = 2500;

export function DestinysExplorer() {
  const [selectedPlace, setSelectedPlace] = useState<DestinyPlace | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const loadingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const selectedPlaceRef = useRef<DestinyPlace | null>(null);

  useEffect(() => {
    return () => {
      if (loadingTimerRef.current) clearTimeout(loadingTimerRef.current);
    };
  }, []);

  const handlePlaceSelect = useCallback((place: DestinyPlace) => {
    if (selectedPlaceRef.current?.id === place.id) return;
    if (loadingTimerRef.current) clearTimeout(loadingTimerRef.current);
    selectedPlaceRef.current = place;
    setSelectedPlace(place);
    setIsLoading(true);
    loadingTimerRef.current = setTimeout(() => {
      setIsLoading(false);
    }, LOADING_DELAY);
  }, []);

  const handleClose = useCallback(() => {
    if (loadingTimerRef.current) clearTimeout(loadingTimerRef.current);
    selectedPlaceRef.current = null;
    setSelectedPlace(null);
    setIsLoading(false);
  }, []);

  const nearbyDestinyPlaces = useMemo(() => {
    if (!selectedPlace) return [];

    return [...destinyPlacesData]
      .filter((place) => place.id !== selectedPlace.id)
      .sort(() => Math.random() - 0.5)
      .slice(0, 2);
  }, [selectedPlace]);

  return (
    <section className="w-full px-6 pb-12 pt-14 sm:px-10 lg:px-16 xl:px-20 2xl:px-28">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16 xl:grid-cols-[1.05fr_0.95fr]">
        <div className="lg:sticky lg:top-24 lg:self-start">
          <DestinyMap
            places={destinyPlacesData}
            onPlaceSelect={handlePlaceSelect}
          />
        </div>

        <div className="flex flex-col">
          {isLoading ? (
            <output
              aria-live="polite"
              className="flex min-h-[55vh] flex-col items-center justify-center gap-4"
            >
              <span className="size-12 animate-spin rounded-full border-4 border-[#AC59EB]/30 border-t-[#3B007F]" />
              <p className="font-sans text-base font-semibold text-[#3B007F]">
                Cargando destino&hellip;
              </p>
            </output>
          ) : selectedPlace ? (
            <div className="flex flex-col gap-8">
              <DestinyPlaceCard
                key={selectedPlace.id}
                place={selectedPlace}
                onClose={handleClose}
              />

              <section className="flex flex-col gap-4">
                <h2 className="text-xl font-bold text-primary">
                  Lugares cercanos
                </h2>

                <div className="flex flex-col gap-8">
                  {nearbyDestinyPlaces.map((place) => (
                    <DestinyPlaceCard key={place.id} place={place} />
                  ))}
                </div>
              </section>
            </div>
          ) : (
            <DestinySearchHero />
          )}
        </div>
      </div>
    </section>
  );
}
