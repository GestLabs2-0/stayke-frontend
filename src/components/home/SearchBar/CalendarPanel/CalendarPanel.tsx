import { useState } from "react";
import { weekDays } from "../mocks";
import { CalendarNavigation } from "./CalendarUtils/CalendarNavigation";
import { DayCell } from "./CalendarUtils/DayCell";

export const CalendarPanel = () => {
  const now = new Date();
  const [Month, setMoth] = useState(now.getMonth());
  const [Year, setYear] = useState(now.getFullYear());
  const hoy = new Date();
  const firstDay = new Date(Year, Month, 1).getDay();
  const daysInMonth = new Date(Year, Month + 1, 0).getDate();

  return (
    <div>
      <CalendarNavigation
        month={Month}
        year={Year}
        onPrev={() => {
          if (Month === 0) {
            setMoth(11);
            setYear(Year - 1);
          } else {
            setMoth(Month - 1);
          }
        }}
        onNext={() => {
          if (Month === 11) {
            setMoth(0);
            setYear(Year + 1);
          } else {
            setMoth(Month + 1);
          }
        }}
      />

      <div className="grid grid-cols-7 gap-1 text-center text-xs text-zinc-500">
        {weekDays.map((day) => (
          <div key={day} className="py-1 font-medium">
            {day}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-sm mt-2">
        {Array.from({ length: firstDay }).map((_, i) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: empty placeholders, no state
          <div key={`empty-${Month}-${i}`} />
        ))}
        {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((dia) => {
          const fechaDia = new Date(Year, Month, dia);
          const hoySinHora = new Date(
            hoy.getFullYear(),
            hoy.getMonth(),
            hoy.getDate(),
          );
          const before = fechaDia < hoySinHora;
          const now =
            dia === hoy.getDate() &&
            Month === hoy.getMonth() &&
            Year === hoy.getFullYear();

          return <DayCell key={dia} day={dia} isPast={before} isToday={now} />;
        })}
      </div>
    </div>
  );
};
