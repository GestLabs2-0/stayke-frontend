"use client";

import { CalendarDays } from "lucide-react";
import { useCallback, useState } from "react";

import { BookingStatus } from "@GestLabs2-0/stayke-escrow";
import { dateToUnix } from "@/helpers/dateToUnix";
import { useWalletContext } from "@/hooks/useWallet";
import {
  BOOKING_STATUS_LABELS,
  PRIORITY_BOOKING_STATUSES,
} from "@/types/api/booking";
import type { BookingStatusFilter } from "@/types/profile/bookings";
import { Breadcrumb } from "../Breadcrumb";
import { BookingFilters } from "./BookingFilters";
import { BookingSection } from "./BookingSection";

/** Títulos de las secciones prioritarias de la vista inicial. */
const PRIORITY_SECTION_TITLES: Partial<Record<BookingStatus, string>> = {
  [BookingStatus.Pending]: "Pendientes por aceptar",
  [BookingStatus.HostAccepted]: "Por comenzar",
  [BookingStatus.Active]: "Activos",
};

function sectionTitle(status: BookingStatus): string {
  return PRIORITY_SECTION_TITLES[status] ?? BOOKING_STATUS_LABELS[status];
}

export function HostBookings() {
  const { userProfile } = useWalletContext();
  const [status, setStatus] = useState<BookingStatusFilter>(null);
  // Totales por estado reportados por cada sección, para el contador del filtro.
  const [counts, setCounts] = useState<Record<number, number>>({});
  const [date, setDate] = useState("");

  const filtersActive = status !== null || date !== "";
  const checkIn = filtersActive ? dateToUnix(date) : undefined;

  const sections =
    status === null
      ? PRIORITY_BOOKING_STATUSES.map((bookingStatus) => ({
          status: bookingStatus,
          title: sectionTitle(bookingStatus),
        }))
      : [{ status, title: sectionTitle(status) }];

  const total = sections.reduce(
    (sum, section) => sum + (counts[section.status ?? -1] ?? 0),
    0,
  );

  // const handleTotalChange = (sectionStatus: BookingStatus) => (count: number) =>
  //   setCounts((prev) => ({ ...prev, [sectionStatus]: count }));

  const handleTotalChange = useCallback(
    (section: BookingStatus | null, count: number) =>
      setCounts((prev) => ({
        ...prev,
        [section ?? -1]: count,
      })),
    [],
  );

  return (
    <div className="space-y-6">
      <Breadcrumb />

      <div className="flex flex-wrap items-center gap-3">
        <span className="flex size-10 items-center justify-center rounded-xl bg-primary/10">
          <CalendarDays className="size-5 text-primary" />
        </span>
        <div>
          <h1 className="font-montserrat text-[22px] font-bold text-[#171717]">
            Reservas
          </h1>
          <p className="font-sans text-sm text-[#434654]">
            Gestioná las reservas de tus alojamientos.
          </p>
        </div>
      </div>

      <BookingFilters
        value={status}
        total={total}
        dateValue={date}
        onChangeDate={setDate}
        onChange={(next) => {
          setCounts({});
          setStatus(next);
        }}
      />

      <div className="space-y-8">
        {sections.map((section) => (
          <BookingSection
            key={section.status}
            status={section.status}
            checkIn={checkIn}
            title={section.title}
            userProfile={userProfile?.address}
            onTotalChange={handleTotalChange}
          />
        ))}
      </div>
    </div>
  );
}
