import type { DayCellProps } from "@/types/header";

export const DayCell = ({ day, isPast, isToday }: DayCellProps) => {
  return (
    <div
      className={`
           py-3 rounded-full transition-colors font-medium
           ${
             isPast
               ? "text-zinc-300 cursor-default"
               : isToday
                 ? "text-zinc-700 font-semibold hover:bg-purple-100 cursor-pointer"
                 : "text-zinc-600 hover:bg-zinc-100 cursor-pointer"
           }
         `}
    >
      {day}
    </div>
  );
};
