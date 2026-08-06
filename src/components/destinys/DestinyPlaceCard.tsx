"use client";

import Image from "next/image";
import { useState } from "react";

import { HeartIcon, StarIcon, XIcon } from "@/icons";
import type { DestinyPlaceCardProps } from "@/types/destinys";
import { DestinyNearbyPlaces } from "./DestinyNearbyPlaces";

function plural(n: number, singular: string, pluralForm: string): string {
  return n === 1 ? `${n} ${singular}` : `${n} ${pluralForm}`;
}

export function DestinyPlaceCard({ place, onClose }: DestinyPlaceCardProps) {
  const [isSaved, setIsSaved] = useState(false);
  const [days] = useState(() => 1 + Math.floor(Math.random() * 5));
  const nights = days + 1;

  return (
    <article className="animate-fade-in-up flex w-full flex-col gap-4">
      <header className="flex flex-col gap-2">
        <div className="flex items-center justify-between gap-4">
          <div className="flex flex-col">
            <h2 className="text-2xl font-bold text-zinc-950 sm:text-3xl">
              {place.country} · {place.city}
            </h2>

            <p className="text-sm font-semibold text-zinc-950 pl-1">
              {plural(days, "día", "días")} y{" "}
              {plural(nights, "noche", "noches")}
            </p>
          </div>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              aria-label="Quitar destino"
              className="flex size-9 shrink-0 items-center justify-center rounded-full bg-zinc-100 text-zinc-800 transition-colors hover:bg-zinc-200 hover:text-zinc-950 cursor-pointer"
            >
              <XIcon className="size-5" />
            </button>
          )}
        </div>
      </header>

      <div className="border-t border-zinc-300" />

      <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-zinc-100">
        <Image
          src={place.image}
          alt={place.name}
          fill
          className="object-cover"
          sizes="(max-width: 1024px) 100vw, 50vw"
        />
        <button
          type="button"
          onClick={() => setIsSaved((prev) => !prev)}
          className="absolute top-3 right-3 flex size-9 items-center justify-center rounded-full bg-white/90 shadow-sm transition-colors hover:bg-white"
          aria-label={isSaved ? "Quitar de favoritos" : "Guardar en favoritos"}
        >
          <HeartIcon
            filled={isSaved}
            className={`size-5 transition-colors cursor-pointer ${
              isSaved ? "text-[#3B007F]" : "text-zinc-800"
            }`}
          />
        </button>
      </div>

      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col">
          <h3 className="text-xl leading-tight font-semibold text-zinc-900">
            {place.name}
          </h3>
          <p className="text-sm font-semibold text-zinc-500">
            {plural(place.bedrooms, "habitación", "habitaciones")} ·{" "}
            {plural(place.guests, "invitado", "invitados")}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-1.5">
          <span className="flex items-center gap-1 rounded-sm px-2 py-0.5 text-sm font-semibold text-[#AC59EB]">
            <StarIcon className="size-5 text-[#AC59EB]" />
            {place.rating.toFixed(1).replace(".", ",")}
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <p className="text-sm text-zinc-500">{place.location}</p>
        <p>
          <span className="text-xl font-bold text-zinc-900">
            {place.price.toLocaleString("es-VE")} $
          </span>
          <span className="ml-1 text-sm text-zinc-500">por noche</span>
        </p>
      </div>

      <DestinyNearbyPlaces places={place.nearby} heading="Cerca de aquí" />
    </article>
  );
}
