"use client";

import type * as Leaflet from "leaflet";
import "leaflet/dist/leaflet.css";

import { useCallback, useEffect, useRef, useState } from "react";

import type { DestinyMapProps, DestinyPlace } from "@/types/destinys";

const DEFAULT_CENTER: [number, number] = [10.4806, -66.9036];
const DEFAULT_ZOOM = 12;
const TILE_URL = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
const ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>';
const MARKER_SIZE: [number, number] = [36, 46];
const MARKER_ANCHOR: [number, number] = [18, 46];

function markerHtml(name: string): string {
  const label = name ? ` title="${name}" aria-label="${name}"` : "";

  return `
    <button
      type="button"
      ${label}
      class="flex h-[46px] w-9 cursor-pointer flex-col items-center transition-transform duration-200 hover:scale-110 hover:drop-shadow-[0_8px_14px_rgba(59,0,127,0.5)]"
    >
      <span class="flex h-9 w-9 items-center justify-center rounded-full border-2 border-white bg-linear-to-b from-[#AC59EB] to-[#3B007F] shadow-[0_4px_10px_rgba(59,0,127,0.45)]">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" class="size-4">
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
        </svg>
      </span>
      <span class="h-0 w-0 border-x-[9px] border-t-[10px] border-x-transparent border-t-[#3B007F]"></span>
    </button>
  `;
}

export function DestinyMap({
  center,
  zoom,
  markers,
  places,
  onPlaceSelect,
}: DestinyMapProps) {
  const [mounted, setMounted] = useState(false);

  const containerRef = useRef<HTMLElement>(null);
  const invalidateTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handlePlaceClick = useCallback(
    (place: DestinyPlace) => {
      onPlaceSelect(place);
    },
    [onPlaceSelect],
  );

  useEffect(() => {
    if (!mounted) return;

    let cancelled = false;
    let map: Leaflet.Map | null = null;

    (async () => {
      const L = await import("leaflet");

      if (cancelled || !containerRef.current) return;

      map = L.map(containerRef.current, {
        center: center ?? DEFAULT_CENTER,
        zoom: zoom ?? DEFAULT_ZOOM,
        zoomControl: true,
      });

      const instance = map;

      L.tileLayer(TILE_URL, {
        attribution: ATTRIBUTION,
        maxZoom: 19,
      }).addTo(instance);

      places?.forEach((place) => {
        const icon = L.divIcon({
          className: "destiny-marker",
          html: markerHtml(place.name),
          iconSize: MARKER_SIZE,
          iconAnchor: MARKER_ANCHOR,
        });

        L.marker([place.lat, place.lng], { icon, bubblingMouseEvents: false })
          .on("click", () => handlePlaceClick(place))
          .addTo(instance);
      });

      markers?.forEach((marker) => {
        const icon = L.divIcon({
          className: "destiny-marker",
          html: markerHtml(""),
          iconSize: MARKER_SIZE,
          iconAnchor: MARKER_ANCHOR,
        });

        L.marker([marker.lat, marker.lng], {
          icon,
          bubblingMouseEvents: false,
        }).addTo(instance);
      });

      invalidateTimerRef.current = setTimeout(
        () => instance.invalidateSize(),
        200,
      );
    })();

    return () => {
      cancelled = true;
      if (invalidateTimerRef.current) clearTimeout(invalidateTimerRef.current);
      map?.remove();
    };
  }, [mounted, center, zoom, markers, places, handlePlaceClick]);

  if (!mounted) {
    return (
      <div className="h-[55vh] min-h-96 w-full animate-pulse overflow-hidden rounded-[40px] bg-[#FFF9F9] lg:h-[calc(100vh-8rem)]" />
    );
  }

  return (
    <div className="relative z-0 h-[55vh] min-h-96 w-full overflow-hidden rounded-[40px] bg-[#FFF9F9] shadow-[0_4px_4px_-2px_rgba(0,0,0,0.12)] lg:h-[calc(100vh-8rem)]">
      <section
        ref={containerRef}
        aria-label="Mapa de destinos en Caracas"
        className="absolute inset-0 z-0"
      />
    </div>
  );
}
