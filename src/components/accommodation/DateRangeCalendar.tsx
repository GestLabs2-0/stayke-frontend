"use client";

import { useState } from "react";

import { monthNames, weekDays } from "@/components/home/SearchBar/mocks";
import { ChevronLeftIcon, ChevronRightIcon } from "@/icons";

interface DateRangeCalendarProps {
  onChange?: (checkIn: Date | null, checkOut: Date | null) => void;
}

export function DateRangeCalendar({ onChange }: DateRangeCalendarProps) {
  const today = new Date();
  const startOfToday = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
  );

  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [checkIn, setCheckIn] = useState<Date | null>(null);
  const [checkOut, setCheckOut] = useState<Date | null>(null);

  const commit = (inDate: Date | null, outDate: Date | null) => {
    setCheckIn(inDate);
    setCheckOut(outDate);
    onChange?.(inDate, outDate);
  };

  const goPrev = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear(viewYear - 1);
    } else {
      setViewMonth(viewMonth - 1);
    }
  };

  const goNext = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear(viewYear + 1);
    } else {
      setViewMonth(viewMonth + 1);
    }
  };

  const selectDay = (day: Date) => {
    if (day < startOfToday) return;
    if (!checkIn || (checkIn && checkOut)) {
      commit(day, null);
      return;
    }
    if (day > checkIn) {
      commit(checkIn, day);
      return;
    }
    commit(day, null);
  };

  const isSelected = (day: Date) =>
    (checkIn && day.getTime() === checkIn.getTime()) ||
    (checkOut && day.getTime() === checkOut.getTime());

  const isInRange = (day: Date) =>
    !!checkIn && !!checkOut && day > checkIn && day < checkOut;

  const isToday = (day: Date) => day.getTime() === startOfToday.getTime();

  const firstDay = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

  return (
    <div className="mt-5 animate-fade-in-up rounded-2xl bg-surface/60 p-3">
      <div className="mb-3 flex items-center justify-between">
        <button
          type="button"
          onClick={goPrev}
          aria-label="Mes anterior"
          className="flex size-8 items-center justify-center rounded-full text-primary transition-colors hover:bg-white active:scale-90"
        >
          <span className="flex [&>svg]:size-4">
            <ChevronLeftIcon />
          </span>
        </button>
        <p className="text-sm font-semibold text-zinc-700">
          {monthNames[viewMonth]} {viewYear}
        </p>
        <button
          type="button"
          onClick={goNext}
          aria-label="Mes siguiente"
          className="flex size-8 items-center justify-center rounded-full text-primary transition-colors hover:bg-white active:scale-90"
        >
          <span className="flex [&>svg]:size-4">
            <ChevronRightIcon />
          </span>
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center text-xs text-zinc-500">
        {weekDays.map((day) => (
          <div key={day} className="py-1 font-medium">
            {day}
          </div>
        ))}
      </div>

      <div className="mt-2 grid grid-cols-7 gap-1 text-center text-sm">
        {Array.from({ length: firstDay }).map((_, i) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: empty placeholders, no state
          <div key={`empty-${i}`} />
        ))}
        {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((num) => {
          const day = new Date(viewYear, viewMonth, num);
          const isPast = day < startOfToday;
          const selected = isSelected(day);
          const inRange = isInRange(day);

          let cellClass =
            "py-2 rounded-full font-medium transition-all duration-150 active:scale-90";
          if (selected) {
            cellClass += " bg-primary text-white";
          } else if (inRange) {
            cellClass += " bg-primary/10 text-primary";
          } else if (isPast) {
            cellClass += " cursor-default text-zinc-300";
          } else {
            cellClass += isToday(day)
              ? " cursor-pointer text-primary font-semibold hover:bg-white"
              : " cursor-pointer text-zinc-600 hover:bg-white";
          }

          return (
            <button
              key={num}
              type="button"
              disabled={isPast}
              onClick={() => selectDay(day)}
              className={cellClass}
            >
              {num}
            </button>
          );
        })}
      </div>
    </div>
  );
}
