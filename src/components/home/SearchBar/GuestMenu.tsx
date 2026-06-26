"use client";

import { useState } from "react";
import { MinusIcon, PlusIcon } from "@/icons";
import { categorias } from "./mocks";

export const GuestMenu = () => {
  const [guestCount, setGuestCount] = useState({
    adultos: 0,
    ninos: 0,
    bebes: 0,
    mascotas: 0,
  });

  const ajustar = (key: keyof typeof guestCount, delta: number) => {
    setGuestCount((prev) => ({
      ...prev,
      [key]: Math.max(0, prev[key] + delta),
    }));
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
              className={`w-8 h-8 rounded-full border transition-colors flex items-center justify-center ${
                guestCount[cat.key] === 0
                  ? "border-zinc-200 text-zinc-300 cursor-not-allowed"
                  : "border-zinc-400 text-zinc-600 hover:border-zinc-800 hover:text-zinc-800"
              }`}
            >
              <MinusIcon />
            </button>
            <span className="w-6 text-center text-sm text-zinc-800">
              {guestCount[cat.key]}
            </span>
            <button
              type="button"
              onClick={() => ajustar(cat.key, 1)}
              className="w-8 h-8 rounded-full border border-zinc-400 text-zinc-600 hover:border-zinc-800 hover:text-zinc-800 transition-colors flex items-center justify-center"
            >
              <PlusIcon />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};
