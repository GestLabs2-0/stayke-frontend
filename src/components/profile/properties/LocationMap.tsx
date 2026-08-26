"use client";

import type * as Leaflet from "leaflet";
import "leaflet/dist/leaflet.css";

import { useCallback, useEffect, useRef, useState } from "react";

import { SearchIcon } from "@/icons/SearchIcon";
import type {
  LocationMapProps,
  NominatimResult,
} from "@/types/property/LocationMap";

const DEFAULT_CENTER: [number, number] = [4.5709, -74.2973];
const DEFAULT_ZOOM = 5;
const MARKER_ZOOM = 15;

export function LocationMap({
  latitude,
  longitude,
  onChange,
}: LocationMapProps) {
  const [mounted, setMounted] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<NominatimResult[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [searching, setSearching] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<Leaflet.Map | null>(null);
  const markerRef = useRef<Leaflet.Marker | null>(null);
  const LRef = useRef<typeof Leaflet | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );
  const searchRef = useRef<HTMLDivElement>(null);
  const initRef = useRef(false);
  const lastEmitted = useRef<{ lat: number; lng: number } | null>(null);

  // ── Helpers ──

  const createMarker = useCallback(
    (L: typeof Leaflet, map: Leaflet.Map, lat: number, lng: number) => {
      const marker = L.marker([lat, lng], { draggable: true }).addTo(map);
      marker.on("dragend", () => {
        const pos = marker.getLatLng();
        lastEmitted.current = { lat: pos.lat, lng: pos.lng };
        onChange(pos.lat, pos.lng);
      });
      markerRef.current = marker;
    },
    [onChange],
  );

  const handlePlace = useCallback(
    (L: typeof Leaflet, map: Leaflet.Map, lat: number, lng: number) => {
      if (markerRef.current) {
        markerRef.current.setLatLng([lat, lng]);
      } else {
        createMarker(L, map, lat, lng);
      }
      lastEmitted.current = { lat, lng };
      onChange(lat, lng);
    },
    [onChange, createMarker],
  );

  const handlePlaceFromSearch = useCallback(
    (lat: number, lng: number) => {
      if (!mapRef.current || !LRef.current) return;
      handlePlace(LRef.current, mapRef.current, lat, lng);
      mapRef.current.flyTo([lat, lng], MARKER_ZOOM);
    },
    [handlePlace],
  );

  // ── Search ──

  const handleSearchInput = useCallback((value: string) => {
    setQuery(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (value.length < 3) {
      setResults([]);
      setShowResults(false);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      setSearching(true);
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(value)}&limit=10`,
          { headers: { "Accept-Language": "es" } },
        );
        if (!res.ok) return;
        const data: NominatimResult[] = await res.json();
        setResults(data);
        setShowResults(data.length > 0);
      } catch {
        setResults([]);
      } finally {
        setSearching(false);
      }
    }, 300);
  }, []);

  const selectResult = useCallback(
    (r: NominatimResult) => {
      setQuery(r.display_name);
      setShowResults(false);
      handlePlaceFromSearch(Number.parseFloat(r.lat), Number.parseFloat(r.lon));
    },
    [handlePlaceFromSearch],
  );

  // ── Close dropdown on click outside ──

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowResults(false);
      }
    };
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setShowResults(false);
    };
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  // ── Initialize map (client only) ──

  useEffect(() => {
    if (!mounted || initRef.current) return;
    initRef.current = true;

    let map: Leaflet.Map | null = null;

    (async () => {
      const L = await import("leaflet");

      if (!containerRef.current) return;

      // delete (L.Icon.Default.prototype)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl:
          "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl:
          "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });

      LRef.current = L;

      const center =
        latitude != null && longitude != null
          ? [latitude, longitude]
          : DEFAULT_CENTER;

      map = L.map(containerRef.current, {
        center: center as Leaflet.LatLngExpression,
        zoom: latitude != null ? MARKER_ZOOM : DEFAULT_ZOOM,
        zoomControl: true,
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
      }).addTo(map);

      if (latitude != null && longitude != null) {
        createMarker(L, map, latitude, longitude);
      }

      map.on("click", (e: Leaflet.LeafletMouseEvent) => {
        if (map) handlePlace(L, map, e.latlng.lat, e.latlng.lng);
      });

      mapRef.current = map;
      setTimeout(() => map?.invalidateSize(), 200);
    })();

    return () => {
      map?.remove();
      mapRef.current = null;
      markerRef.current = null;
      initRef.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted, latitude, longitude, createMarker, handlePlace]);

  // ── Sync marker when lat/lng change externally ──

  useEffect(() => {
    if (
      !mapRef.current ||
      !LRef.current ||
      latitude == null ||
      longitude == null
    ) {
      return;
    }

    if (
      lastEmitted.current &&
      lastEmitted.current.lat === latitude &&
      lastEmitted.current.lng === longitude
    ) {
      return;
    }

    const L = LRef.current;

    if (markerRef.current) {
      markerRef.current.setLatLng([latitude, longitude]);
    } else {
      createMarker(L, mapRef.current, latitude, longitude);
    }

    mapRef.current.flyTo([latitude, longitude], MARKER_ZOOM);
  }, [latitude, longitude, createMarker]);

  // ── Derive display value ──

  const hasPosition = latitude != null && longitude != null;
  const displayLat = markerRef.current
    ? markerRef.current.getLatLng().lat
    : latitude;
  const displayLng = markerRef.current
    ? markerRef.current.getLatLng().lng
    : longitude;

  // ── Render ──

  if (!mounted) {
    return (
      <div className="rounded-2xl border border-[#c3c6d6] bg-white p-5">
        <div className="space-y-4">
          <p className="font-plus-jakarta text-[15px] font-semibold text-[#434654]">
            Busca tu ubicaci&oacute;n
          </p>
          <div className="h-75 animate-pulse rounded-xl bg-[#ebe7e7] md:h-100" />
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-[#c3c6d6] bg-white p-5">
      <div className="space-y-4">
        <label
          htmlFor="search_location"
          className="font-plus-jakarta text-[15px] font-semibold text-[#434654]"
        >
          Busca tu ubicaci&oacute;n
        </label>

        {/* Search */}
        <div ref={searchRef} className="relative">
          <div className="relative">
            <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-[#a0a5b5]">
              <SearchIcon />
            </span>
            <input
              type="text"
              id="search_location"
              value={query}
              onChange={(e) => handleSearchInput(e.target.value)}
              placeholder="Buscar direcci&oacute;n..."
              className="w-full rounded-xl border border-[#c3c6d6] bg-white py-2.5 pl-10 pr-4 font-sans text-[14px] text-[#434654] outline-none transition-colors placeholder:text-[#a0a5b5] focus:border-[#3b007f] focus:ring-1 focus:ring-[#3b007f]"
            />
            {searching && (
              <span className="absolute inset-y-0 right-3 flex items-center">
                <span className="inline-block size-4 animate-spin rounded-full border-2 border-[#c3c6d6] border-t-[#3b007f]" />
              </span>
            )}
          </div>

          {showResults && results.length > 0 && (
            <ul className="absolute z-1000 mt-1 w-full overflow-hidden rounded-xl border border-[#c3c6d6] bg-white shadow-lg">
              {results.map((r) => (
                <li key={r.lat + r.lon}>
                  <button
                    type="button"
                    onClick={() => selectResult(r)}
                    className="w-full px-4 py-2.5 text-left font-sans text-[13px] text-[#434654] transition-colors hover:bg-[#3b007f]/5 first:rounded-t-xl last:rounded-b-xl"
                  >
                    {r.display_name}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Map */}
        <div
          ref={containerRef}
          className="z-0 h-75 w-full overflow-hidden rounded-xl border border-[#c3c6d6] md:h-100"
        />

        {/* Coordinates */}
        {hasPosition && (
          <p className="font-plus-jakarta text-[13px] text-[#a0a5b5]">
            {displayLat?.toFixed(6)}, {displayLng?.toFixed(6)}
          </p>
        )}
      </div>
    </div>
  );
}
