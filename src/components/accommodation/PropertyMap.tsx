"use client";

import type * as Leaflet from "leaflet";
import "leaflet/dist/leaflet.css";

import { useEffect, useRef, useState } from "react";

import { LocationIcon } from "@/icons";

const MARKER_ZOOM = 15;

interface PropertyMapProps {
  latitude: number;
  longitude: number;
  address?: string;
  city?: string;
}

export function PropertyMap({
  latitude,
  longitude,
  address,
  city,
}: PropertyMapProps) {
  const [mounted, setMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<Leaflet.Map | null>(null);
  const initRef = useRef(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || initRef.current) return;
    initRef.current = true;

    let disposed = false;
    let map: Leaflet.Map | null = null;

    (async () => {
      const L = await import("leaflet");

      if (disposed || !containerRef.current) return;

      L.Icon.Default.mergeOptions({
        iconRetinaUrl:
          "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl:
          "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });

      map = L.map(containerRef.current, {
        center: [latitude, longitude],
        zoom: MARKER_ZOOM,
        zoomControl: true,
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
      }).addTo(map);

      L.marker([latitude, longitude]).addTo(map);

      mapRef.current = map;
      setTimeout(() => map?.invalidateSize(), 200);
    })();

    return () => {
      disposed = true;
      map?.remove();
      mapRef.current = null;
      initRef.current = false;
    };
  }, [mounted, latitude, longitude]);

  const caption = [address, city].filter(Boolean).join(", ");

  return (
    <section className="card-white">
      <h2 className="text-xl font-semibold text-zinc-900">Ubicación</h2>

      <div className="relative mt-4 h-72 w-full overflow-hidden rounded-2xl border border-border">
        <div ref={containerRef} className="h-full w-full" />
      </div>

      {caption && (
        <p className="mt-3 flex items-start gap-2 text-sm text-zinc-500">
          <span className="mt-0.5 size-4 shrink-0">
            <LocationIcon />
          </span>
          {caption}
        </p>
      )}
    </section>
  );
}
