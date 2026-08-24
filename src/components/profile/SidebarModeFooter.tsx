"use client";

import { routes } from "@/constants/routes";
import type { SidebarModeFooterProps } from "@/types/profile";
import { ModeSwitch } from "./ModeSwitch";

export function SidebarModeFooter({
  mode,
  expanded,
  onChangeMode,
  onNavigate,
}: SidebarModeFooterProps) {
  return (
    <div className="px-3 py-3">
      {expanded && (
        <div className="mx-auto w-fit mb-4">
          <ModeSwitch
            isHost={mode === "host"}
            changeMode={(m) => {
              onChangeMode(m);
              onNavigate(routes.Profile.index, routes.Profile.index);
            }}
          />
        </div>
      )}

      <div
        className={`flex items-center gap-2 rounded-lg px-2 py-1.5 text-xs font-semibold ${
          mode === "host"
            ? "bg-[#3b007f]/10 text-[#3b007f]"
            : "bg-white text-[#434654]"
        }`}
      >
        <span className="size-1.5 rounded-full bg-current" />
        {expanded && (
          <span className="overflow-hidden whitespace-nowrap transition-all duration-200">
            {mode === "host" ? "Anfitrión" : "Huésped"}
          </span>
        )}
      </div>
    </div>
  );
}
