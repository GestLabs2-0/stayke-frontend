"use client";

import type { LucideIcon } from "lucide-react";
import { Clapperboard, Store, UtensilsCrossed } from "lucide-react";

import type {
  DestinyNearbyPlacesProps,
  DestinyNearbyType,
} from "@/types/destinys";

const NEARBY_ICONS: Record<DestinyNearbyType, LucideIcon> = {
  restaurant: UtensilsCrossed,
  market: Store,
  cinema: Clapperboard,
};

export function DestinyNearbyPlaces({
  places,
  heading,
}: DestinyNearbyPlacesProps) {
  return (
    <div className="flex flex-col gap-3">
      {heading && (
        <h3 className="text-sm font-semibold text-zinc-900">{heading}</h3>
      )}

      <ul className="flex flex-col gap-3">
        {places.map((place) => {
          const Icon = NEARBY_ICONS[place.type];

          return (
            <li key={place.id} className="flex items-start gap-4">
              <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-[#AC59EB]/10 text-[#3B007F]">
                <Icon className="size-5" />
              </span>
              <div className="flex flex-col gap-0.5">
                <h4 className="text-base font-semibold text-zinc-900">
                  {place.name}
                </h4>
                <p className="text-sm text-zinc-500">{place.description}</p>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
