"use client";

import type { SearchPanelProps } from "@/types/header";
import { CalendarPanel } from "./CalendarPanel/CalendarPanel";
import { DestinationMenu } from "./DestinationMenu";
import { GuestMenu } from "./GuestMenu";

export const SearchPanel = ({
  activeField,
  onSelectDestination,
  guestCounts,
  onAdjustGuest,
}: SearchPanelProps) => {
  return (
    <div
      className={`
              absolute top-full mt-3 bg-white rounded-3xl
    shadow-xl border border-zinc-200 p-6 z-50
              transition-all duration-300 ease-out
              ${
                activeField === "destination"
                  ? "w-full md:w-96 left-0"
                  : activeField === "guest"
                    ? "w-full md:w-80 right-0"
                    : "w-full left-0"
              }
              ${
                activeField !== null
                  ? "opacity-100 visible translate-y-0"
                  : "opacity-0 invisible -translate-y-2 pointer-events-none"
              }
            `}
    >
      {activeField === "destination" && (
        <DestinationMenu onSelectDestination={onSelectDestination} />
      )}
      {activeField === "dates" && <CalendarPanel />}
      {activeField === "guest" && (
        <GuestMenu guestCounts={guestCounts} onAdjustGuest={onAdjustGuest} />
      )}
    </div>
  );
};
