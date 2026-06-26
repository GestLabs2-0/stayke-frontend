import { ChevronLeftIcon, ChevronRightIcon } from "@/icons";
import type { CalendarNavigationProps } from "@/types/header";
import { monthNames } from "../../mocks";

export const CalendarNavigation = ({
  month,
  year,
  onPrev,
  onNext,
}: CalendarNavigationProps) => {
  return (
    <div className="flex items-center justify-between mb-4">
      <button
        type="button"
        onClick={onPrev}
        className="p-2 rounded-full hover:bg-purple-100 text-purple-600 transition-colors flex
 items-center justify-center"
      >
        <ChevronLeftIcon />
      </button>
      <p className="text-xs font-semibold text-zinc-500">
        {monthNames[month]} {year}
      </p>
      <button
        type="button"
        onClick={onNext}
        className="p-2 rounded-full hover:bg-purple-100 text-purple-600 transition-colors flex
 items-center justify-center"
      >
        <ChevronRightIcon />
      </button>
    </div>
  );
};
