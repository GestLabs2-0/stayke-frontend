"use client";

import { RotateCcw } from "lucide-react";

import { BookingStatus } from "@GestLabs2-0/stayke-escrow";
import { BOOKING_STATUS_LABELS } from "@/types/api/booking";
import type {
  BookingFiltersProps,
  BookingStatusFilter,
} from "@/types/profile/bookings";

const ALL_VALUE = "";

/** Estados en el orden del enum, para construir las opciones del filtro. */
const STATUS_OPTIONS: { value: string; label: string }[] = [
  BookingStatus.Pending,
  BookingStatus.HostAccepted,
  BookingStatus.Active,
  BookingStatus.Completed,
  BookingStatus.Released,
  BookingStatus.Cancelled,
  BookingStatus.Disputed,
  BookingStatus.DisputeResolved,
  BookingStatus.DisputeRejected,
].map((status) => ({
  value: String(status),
  label: BOOKING_STATUS_LABELS[status],
}));

function parseValue(raw: string): BookingStatusFilter {
  if (raw === ALL_VALUE) return null;
  const status = Number(raw);
  return status in BookingStatus ? (status as BookingStatus) : null;
}

const selectBase =
  "w-full rounded-[10px] bg-[#EFF3F6] px-4 py-3 font-plus-jakarta text-[14px] font-semibold text-[#171717] focus-visible:outline-none focus-visible:shadow-[0_0_0_2px_rgba(59,0,127,0.4)] appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2216%22%20height%3D%2216%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%237C838F%22%20stroke-width%3D%222%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%2F%3E%3C%2Fsvg%3E')] bg-[length:16px] bg-[right_16px_center] bg-no-repeat pr-10";

export function BookingFilters({
  value,
  total,
  onChange,
}: BookingFiltersProps) {
  const current = value === null ? ALL_VALUE : String(value);

  return (
    <div className="card-white space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="font-montserrat text-[15px] font-bold text-[#171717]">
          Filtrar reservas
          <span className="ml-2 font-sans text-sm font-semibold text-[#a0a5b5]">
            ({total})
          </span>
        </h3>
        <button
          type="button"
          onClick={() => onChange(null)}
          className="cursor-pointer inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 font-plus-jakarta text-[13px] font-semibold text-[#3b007f] transition-colors hover:bg-[#3b007f]/5"
        >
          <RotateCcw className="size-4" />
          Limpiar
        </button>
      </div>

      <div className="max-w-sm">
        <label
          htmlFor="filter-booking-status"
          className="font-plus-jakarta text-[13px] font-semibold text-[#434654]"
        >
          Estado
        </label>
        <select
          id="filter-booking-status"
          className={`${selectBase} mt-1.5`}
          value={current}
          onChange={(e) => onChange(parseValue(e.target.value))}
        >
          <option value={ALL_VALUE}>Todas</option>
          {STATUS_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
