"use client";

import type * as Leaflet from "leaflet";
import "leaflet/dist/leaflet.css";

import { useCallback, useEffect, useRef, useState } from "react";

import type {
  DestinyMapProps,
  DestinyPlace,
  MapBounds,
} from "@/types/destinys";

const DEFAULT_CENTER: [number, number] = [10.4806, -66.9036];
const DEFAULT_ZOOM = 13;
const TILE_URL = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
const ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>';
const MARKER_SIZE: [number, number] = [80, 48];
const MARKER_ANCHOR: [number, number] = [40, 44];

function markerHtml(place: DestinyPlace, isSelected: boolean): string {
  const priceText = `${place.price.toLocaleString("es-VE")} $`;
  const activeClass = isSelected
    ? "scale-115 z-50 drop-shadow-[0_10px_20px_rgba(59,0,127,0.6)] ring-2 ring-[#AC59EB]"
    : "hover:scale-110 drop-shadow-[0_4px_10px_rgba(59,0,127,0.35)]";

  return `
    <div class="relative flex flex-col items-center cursor-pointer transition-all duration-200 ${activeClass}">
      <div class="flex items-center gap-1.5 px-3 py-1.5 rounded-full border-2 border-white ${
        isSelected
          ? "bg-[#3B007F] text-white"
          : "bg-linear-to-r from-[#AC59EB] to-[#3B007F] text-white"
      } font-sans text-xs font-bold shadow-md">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-3.5 shrink-0">
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
        </svg>
        <span>${priceText}</span>
      </div>
      <div class="h-0 w-0 border-x-[6px] border-t-[8px] border-x-transparent border-t-[#3B007F] -mt-0.5"></div>
    </div>
  `;
}

export function DestinyMap({
  center,
  zoom,
  markers,
  places,
  selectedPlaceId,
  onPlaceSelect,
  onBoundsChange,
}: DestinyMapProps) {
  const [mounted, setMounted] = useState(false);

  const containerRef = useRef<HTMLElement>(null);
  const mapRef = useRef<Leaflet.Map | null>(null);
  const markersLayerRef = useRef<Leaflet.LayerGroup | null>(null);
  const onBoundsChangeRef = useRef(onBoundsChange);
  onBoundsChangeRef.current = onBoundsChange;

  useEffect(() => {
    setMounted(true);
  }, []);

  const handlePlaceClick = useCallback(
    (place: DestinyPlace) => {
      onPlaceSelect(place);
    },
    [onPlaceSelect],
  );

  // Initialize Map
  useEffect(() => {
    if (!mounted || !containerRef.current || mapRef.current) return;

    let cancelled = false;

    (async () => {
      const L = await import("leaflet");

      if (cancelled || !containerRef.current) return;

      const initialCenter = center ?? DEFAULT_CENTER;
      const initialZoom = zoom ?? DEFAULT_ZOOM;

      const map = L.map(containerRef.current, {
        center: initialCenter,
        zoom: initialZoom,
        zoomControl: true,
      });

      mapRef.current = map;

      L.tileLayer(TILE_URL, {
        attribution: ATTRIBUTION,
        maxZoom: 19,
      }).addTo(map);

      const markersLayer = L.layerGroup().addTo(map);
      markersLayerRef.current = markersLayer;

      const notifyBounds = () => {
        if (!map) return;
        const bounds = map.getBounds();
        const b: MapBounds = {
          north: bounds.getNorth(),
          south: bounds.getSouth(),
          west: bounds.getWest(),
          east: bounds.getEast(),
        };
        onBoundsChangeRef.current?.(b);
      };

      map.whenReady(() => {
        setTimeout(() => {
          map.invalidateSize();
          notifyBounds();
        }, 150);
      });

      map.on("moveend", () => {
        notifyBounds();
      });
    })();

    return () => {
      cancelled = true;
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
        markersLayerRef.current = null;
      }
    };
  }, [mounted, center, zoom]);

  // Center update
  useEffect(() => {
    if (!mapRef.current || !center) return;
    const currentCenter = mapRef.current.getCenter();
    if (
      Math.abs(currentCenter.lat - center[0]) > 0.0001 ||
      Math.abs(currentCenter.lng - center[1]) > 0.0001
    ) {
      mapRef.current.setView(center, zoom ?? mapRef.current.getZoom());
    }
  }, [center, zoom]);

  // Markers update
  useEffect(() => {
    if (!mapRef.current || !markersLayerRef.current) return;

    let cancelled = false;

    (async () => {
      const L = await import("leaflet");
      if (cancelled || !markersLayerRef.current) return;

      const layer = markersLayerRef.current;
      if (!layer) return;

      layer.clearLayers();

      places?.forEach((place) => {
        if (Number.isNaN(place.lat) || Number.isNaN(place.lng)) return;

        const isSelected = place.id === selectedPlaceId;
        const icon = L.divIcon({
          className: "destiny-price-marker",
          html: markerHtml(place, isSelected),
          iconSize: MARKER_SIZE,
          iconAnchor: MARKER_ANCHOR,
        });

        const marker = L.marker([place.lat, place.lng], {
          icon,
          bubblingMouseEvents: false,
          zIndexOffset: isSelected ? 1000 : 0,
        });

        marker.on("click", () => handlePlaceClick(place));
        marker.addTo(layer);
      });

      markers?.forEach((marker) => {
        if (Number.isNaN(marker.lat) || Number.isNaN(marker.lng)) return;

        const icon = L.divIcon({
          className: "destiny-generic-marker",
          html: `
            <div class="w-4 h-4 bg-purple-600 rounded-full border-2 border-white shadow-md"></div>
          `,
          iconSize: [16, 16],
          iconAnchor: [8, 8],
        });

        L.marker([marker.lat, marker.lng], {
          icon,
          bubblingMouseEvents: false,
        }).addTo(layer);
      });
    })();

    return () => {
      cancelled = true;
    };
  }, [places, markers, selectedPlaceId, handlePlaceClick]);

  if (!mounted) {
    return (
      <div className="h-[55vh] min-h-96 w-full animate-pulse overflow-hidden rounded-[32px] bg-zinc-100 lg:h-[calc(100vh-8rem)]" />
    );
  }

  return (
    <div className="relative z-0 h-[55vh] min-h-96 w-full overflow-hidden rounded-[32px] border border-zinc-200/80 bg-[#FFF9F9] shadow-lg lg:h-[calc(100vh-8rem)]">
      <section
        ref={containerRef}
        aria-label="Mapa de destinos y alojamientos"
        className="absolute inset-0 z-0"
      />
    </div>
  );
}
