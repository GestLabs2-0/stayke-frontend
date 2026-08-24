"use client";

import Image from "next/image";
import Link from "next/link";
import type { MouseEvent } from "react";
import { useState } from "react";

import { routes } from "@/constants/routes";
import { HeartIcon, StarIcon, XIcon } from "@/icons";
import type { DestinyPlaceCardProps } from "@/types/destinys";

function plural(n: number, singular: string, pluralForm: string): string {
  return n === 1 ? `${n} ${singular}` : `${n} ${pluralForm}`;
}

export function DestinyPlaceCard({
  place,
  onClose,
  isSelected,
  onSelect,
  index = 0,
}: DestinyPlaceCardProps) {
  const [isSaved, setIsSaved] = useState(false);
  const accommodationHref = `${routes.Accommodation}/${place.pda || place.id}`;

  const handleFavoriteClick = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsSaved((prev) => !prev);
  };

  const handleCloseClick = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onClose?.();
  };

  return (
    <Link
      href={accommodationHref}
      onMouseEnter={() => onSelect?.(place)}
      onFocus={() => onSelect?.(place)}
      style={{ animationDelay: `${index * 50}ms` }}
      className={`group relative flex flex-col gap-2.5 rounded-2xl border bg-white p-3 shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg cursor-pointer ${
        isSelected
          ? "border-[#AC59EB] ring-2 ring-[#AC59EB]/30 shadow-md"
          : "border-zinc-200/80 hover:border-zinc-300"
      }`}
    >
      {onClose && (
        <div className="flex items-center justify-between">
          <h6 className="text-sm font-bold text-zinc-900 line-clamp-1">
            {place.city ? `${place.city}, ${place.country}` : place.name}
          </h6>
          <button
            type="button"
            onClick={handleCloseClick}
            aria-label="Cerrar detalles"
            className="flex size-6 shrink-0 items-center justify-center rounded-full bg-zinc-100 text-zinc-600 transition-colors hover:bg-zinc-200 cursor-pointer"
          >
            <XIcon className="size-3.5" />
          </button>
        </div>
      )}

      {/* Compact Image Container */}
      <div className="relative aspect-16/10 w-full overflow-hidden rounded-xl bg-zinc-100">
        <Image
          src={place.image || "/image-slider-one.webp"}
          alt={place.name}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/25 via-transparent to-transparent pointer-events-none" />

        {place.propertyType && (
          <span className="absolute top-2 left-2 rounded-full bg-white/95 backdrop-blur-xs px-2 py-0.5 text-[10px] font-semibold text-zinc-800 shadow-xs uppercase tracking-wider">
            {place.propertyType}
          </span>
        )}

        <button
          type="button"
          onClick={handleFavoriteClick}
          className="absolute top-2 right-2 flex size-7 items-center justify-center rounded-full bg-white/90 shadow-sm transition-transform active:scale-90 hover:bg-white cursor-pointer"
          aria-label={isSaved ? "Quitar de favoritos" : "Guardar en favoritos"}
        >
          <HeartIcon
            filled={isSaved}
            className={`size-4 transition-colors ${
              isSaved ? "text-[#3B007F]" : "text-zinc-700"
            }`}
          />
        </button>
      </div>

      {/* Compact Details */}
      <div className="flex flex-col gap-1">
        <div className="flex items-start justify-between gap-1.5">
          <h3 className="text-sm font-bold text-zinc-900 leading-tight group-hover:text-purple-700 transition-colors line-clamp-1">
            {place.name}
          </h3>
          <span className="flex items-center gap-0.5 shrink-0 rounded-md bg-purple-50 px-1.5 py-0.5 text-[11px] font-bold text-purple-700">
            <StarIcon className="size-3 text-amber-500" />
            {place.rating.toFixed(1).replace(".", ",")}
          </span>
        </div>

        <p className="text-[11px] text-zinc-500 line-clamp-1">
          {place.location}
        </p>

        <p className="text-[11px] font-medium text-zinc-600">
          {plural(place.bedrooms, "hab.", "habs.")} ·{" "}
          {plural(place.guests, "huésped", "huéspedes")}
        </p>

        <div className="mt-1 flex items-center justify-between pt-1.5 border-t border-zinc-100">
          <div>
            <span className="text-sm font-extrabold text-zinc-950">
              {place.price.toLocaleString("es-VE")} $
            </span>
            <span className="ml-1 text-[11px] font-medium text-zinc-500">
              / noche
            </span>
          </div>

          <span className="inline-flex items-center justify-center rounded-lg bg-purple-600 hover:bg-purple-700 group-hover:bg-purple-700 px-2.5 py-1 text-[11px] font-bold text-white shadow-xs transition-colors">
            Ver detalle
          </span>
        </div>
      </div>
    </Link>
  );
}
