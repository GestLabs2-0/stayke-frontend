"use client";

import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import {
  isPropertyInBounds,
  propertyToDestinyPlace,
} from "@/helpers/propertyToDestinyPlace";
import { staykeApi } from "@/lib/staykeApi";
import type { DestinyPlace, MapBounds } from "@/types/destinys";
import { DestinyCardsSkeleton } from "./DestinyCardsSkeleton";
import { DestinyEmptyState } from "./DestinyEmptyState";
import { DestinyMap } from "./DestinyMap";
import { DestinyPagination } from "./DestinyPagination";
import { DestinyPlaceCard } from "./DestinyPlaceCard";
import { DestinyResultsHeader } from "./DestinyResultsHeader";
import { DestinySearchBox } from "./DestinySearchBox";

const DEFAULT_CENTER: [number, number] = [10.4806, -66.9036];
const PAGE_SIZE = 6;

export function DestinysExplorer() {
  const searchParams = useSearchParams();

  // Read URL query parameters
  const latParam = searchParams.get("lat");
  const longParam = searchParams.get("long");
  const minGuestsParam = searchParams.get("minGuests");
  const locationParam = searchParams.get("location");

  const minGuests = minGuestsParam
    ? Math.max(1, parseInt(minGuestsParam, 10))
    : 1;

  const initialCenter = useMemo<[number, number]>(() => {
    if (latParam && longParam) {
      const lat = parseFloat(latParam);
      const lng = parseFloat(longParam);
      if (!Number.isNaN(lat) && !Number.isNaN(lng)) {
        return [lat, lng];
      }
    }
    return DEFAULT_CENTER;
  }, [latParam, longParam]);

  const [mapCenter, setMapCenter] = useState<[number, number]>(initialCenter);
  const [mapBounds, setMapBounds] = useState<MapBounds | null>(null);
  const [allProperties, setAllProperties] = useState<DestinyPlace[]>([]);
  const [selectedPlace, setSelectedPlace] = useState<DestinyPlace | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  const listTopRef = useRef<HTMLDivElement>(null);

  // Synchronize initial center from URL params
  useEffect(() => {
    setMapCenter(initialCenter);
  }, [initialCenter]);

  // Handle location search selection
  const handleSelectLocation = useCallback(
    ({ lat, lng }: { name: string; lat: number; lng: number }) => {
      setMapCenter([lat, lng]);
    },
    [],
  );

  // Handle bounds update emitted by the Leaflet map
  const handleBoundsChange = useCallback((bounds: MapBounds) => {
    setMapBounds(bounds);
  }, []);

  // Fetch properties inside the current bounding box
  useEffect(() => {
    if (!mapBounds) return;

    let cancelled = false;
    setIsLoading(true);

    const { north, south, west, east } = mapBounds;

    staykeApi
      .getProperties({
        north,
        south,
        west,
        east,
        guests: minGuests,
        isActive: true,
        limit: 100,
      })
      .then((result) => {
        if (cancelled) return;

        let places: DestinyPlace[] = [];

        if (
          result.status &&
          Array.isArray(result.data) &&
          result.data.length > 0
        ) {
          places = result.data
            .filter((p) => {
              const inBounds = isPropertyInBounds(
                Number(p.latitude),
                Number(p.longitude),
                mapBounds,
              );
              const guestOk = p.maxGuest ? p.maxGuest >= minGuests : true;
              return inBounds && guestOk;
            })
            .map(propertyToDestinyPlace);
        }

        setAllProperties(places);
        setCurrentPage(1);
        setSelectedPlace(null);
        setIsLoading(false);
      })
      .catch(() => {
        if (cancelled) return;
        setAllProperties([]);
        setCurrentPage(1);
        setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [mapBounds, minGuests]);

  // Pagination calculation
  const totalItems = allProperties.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / PAGE_SIZE));

  const currentPagePlaces = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return allProperties.slice(start, start + PAGE_SIZE);
  }, [allProperties, currentPage]);

  const handlePlaceSelect = useCallback((place: DestinyPlace) => {
    setSelectedPlace((prev) => (prev?.id === place.id ? null : place));
  }, []);

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    setCurrentPage(newPage);
    listTopRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="w-full px-4 pb-16 pt-14 sm:px-6 lg:px-8 xl:px-12">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-8">
        {/* Left Column: Interactive Leaflet Map */}
        <div className="order-2 lg:order-1 lg:col-span-6 xl:col-span-7 lg:sticky lg:top-24 lg:self-start">
          <DestinyMap
            center={mapCenter}
            places={currentPagePlaces}
            selectedPlaceId={selectedPlace?.id}
            onPlaceSelect={handlePlaceSelect}
            onBoundsChange={handleBoundsChange}
          />
        </div>

        {/* Right Column: Search Box & Paginated Cards */}
        <div className="order-1 lg:order-2 lg:col-span-6 xl:col-span-5 flex flex-col justify-between">
          <div ref={listTopRef} className="flex flex-col gap-4">
            <DestinySearchBox
              initialValue={locationParam || ""}
              onSelectLocation={handleSelectLocation}
            />

            <DestinyResultsHeader
              totalItems={totalItems}
              isLoading={isLoading}
            />

            {isLoading ? (
              <DestinyCardsSkeleton count={PAGE_SIZE} />
            ) : currentPagePlaces.length === 0 ? (
              <DestinyEmptyState />
            ) : (
              <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
                {currentPagePlaces.map((place, idx) => (
                  <DestinyPlaceCard
                    key={place.id}
                    place={place}
                    index={idx}
                    isSelected={selectedPlace?.id === place.id}
                    onSelect={handlePlaceSelect}
                  />
                ))}
              </div>
            )}
          </div>

          <DestinyPagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalItems}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
    </section>
  );
}
