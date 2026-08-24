"use client";

import { MinusIcon, PlusIcon } from "@/icons";
import type { GuestCounts } from "@/types/header";
import { categorias } from "./mocks";

interface GuestMenuProps {
  guestCounts?: GuestCounts;
  onAdjustGuest?: (key: keyof GuestCounts, delta: number) => void;
}

export const GuestMenu = ({ guestCounts, onAdjustGuest }: GuestMenuProps) => {
  const counts: GuestCounts = guestCounts ?? {
    adultos: 0,
    ninos: 0,
    bebes: 0,
    mascotas: 0,
  };

  const ajustar = (key: keyof GuestCounts, delta: number) => {
    onAdjustGuest?.(key, delta);
  };

  return (
    <div className="space-y-6">
      {categorias.map((cat) => (
        <div key={cat.label} className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-zinc-800">{cat.label}</p>
            <p className="text-xs text-zinc-500">{cat.descripcion}</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => ajustar(cat.key, -1)}
              disabled={counts[cat.key] === 0}
              className={`w-8 h-8 rounded-full border transition-colors flex items-center justify-center ${
                counts[cat.key] === 0
                  ? "border-zinc-200 text-zinc-300 cursor-not-allowed"
                  : "border-zinc-400 text-zinc-600 hover:border-zinc-800 hover:text-zinc-800 cursor-pointer"
              }`}
            >
              <MinusIcon />
            </button>
            <span className="w-6 text-center text-sm text-zinc-800">
              {counts[cat.key]}
            </span>
            <button
              type="button"
              onClick={() => ajustar(cat.key, 1)}
              className="w-8 h-8 rounded-full border border-zinc-400 text-zinc-600 hover:border-zinc-800 hover:text-zinc-800 transition-colors flex items-center justify-center cursor-pointer"
            >
              <PlusIcon />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};
