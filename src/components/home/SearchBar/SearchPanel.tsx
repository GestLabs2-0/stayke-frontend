"use client";

import type { SearchPanelProps } from "@/types/header";
import { CalendarPanel } from "./CalendarPanel/CalendarPanel";
import { DestinationMenu } from "./DestinationMenu";
import { GuestMenu } from "./GuestMenu";

export const SearchPanel = ({ activeField }: SearchPanelProps) => {
  return (
    <div
      className={`
              absolute top-full mt-3 bg-white rounded-3xl
    shadow-xl border border-zinc-200 p-6
              transition-all duration-300 ease-out
              ${
                activeField === "destination"
                  ? "w-1/2 left-0"
                  : activeField === "guest"
                    ? "w-1/2 left-1/2"
                    : "w-full left-0"
              }
              ${
                activeField !== null
                  ? "opacity-100 visible translate-x-0"
                  : "opacity-0 invisible translate-x-2"
              }
            `}
    >
      {activeField === "destination" && <DestinationMenu />}
      {activeField === "dates" && <CalendarPanel />}
      {activeField === "guest" && <GuestMenu />}
    </div>
  );
};
