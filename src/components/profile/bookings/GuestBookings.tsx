"use client";

import { CalendarDays } from "lucide-react";
import { useState } from "react";

import { BookingStatus } from "@GestLabs2-0/stayke-escrow";
import { useWalletContext } from "@/hooks/useWallet";
import { BOOKING_STATUS_LABELS } from "@/types/api/booking";
import type {
  BookingRole,
  BookingSectionProps,
  BookingStatusFilter,
} from "@/types/profile/bookings";
import { Breadcrumb } from "../Breadcrumb";
import { BookingFilters } from "./BookingFilters";
import { BookingSection } from "./BookingSection";

/** Secciones prioritarias de la vista del huésped en el orden de la especificación. */
const GUEST_SECTIONS: { status: BookingStatus; title: string }[] = [
  { status: BookingStatus.Active, title: "Activos" },
  { status: BookingStatus.Completed, title: "Completadas" },
  { status: BookingStatus.Pending, title: "Pendientes por aceptar" },
  { status: BookingStatus.HostAccepted, title: "Por comenzar" },
  { status: BookingStatus.Released, title: "Fondos liberados" },
];

const ROLE: BookingRole = "guest";
const ALL_STATUSES_KEY = -1;

function sectionTitle(status: BookingStatus): string {
  return (
    GUEST_SECTIONS.find((section) => section.status === status)?.title ??
    BOOKING_STATUS_LABELS[status]
  );
}

/** Convierte "YYYY-MM-DD" a timestamp Unix (media noche local). */
function dateToUnix(date: string): number | undefined {
  if (!date) return undefined;
  const ms = new Date(`${date}T00:00:00`).getTime();
  return Number.isNaN(ms) ? undefined : Math.floor(ms / 1000);
}

export function GuestBookings() {
  const { userWallet } = useWalletContext();
  const [status, setStatus] = useState<BookingStatusFilter>(null);
  const [date, setDate] = useState("");
  // Totales por estado reportados por cada sección, para el contador del filtro.
  const [counts, setCounts] = useState<Record<number, number>>({});

  const filtersActive = status !== null || date !== "";
  const checkIn = filtersActive ? dateToUnix(date) : undefined;

  const sections: Pick<BookingSectionProps, "status" | "title">[] =
    filtersActive
      ? [
          {
            status,
            title:
              status === null ? "Todas las reservas" : sectionTitle(status),
          },
        ]
      : GUEST_SECTIONS;

  const total = sections.reduce(
    (sum, section) => sum + (counts[section.status ?? ALL_STATUSES_KEY] ?? 0),
    0,
  );

  const handleTotalChange =
    (section: BookingStatus | null) => (count: number) =>
      setCounts((prev) => ({
        ...prev,
        [section ?? ALL_STATUSES_KEY]: count,
      }));

  return (
    <div className="space-y-6">
      <Breadcrumb />

      <div className="flex flex-wrap items-center gap-3">
        <span className="flex size-10 items-center justify-center rounded-xl bg-primary/10">
          <CalendarDays className="size-5 text-primary" />
        </span>
        <div>
          <h1 className="font-montserrat text-[22px] font-bold text-[#171717]">
            Mis reservas
          </h1>
          <p className="font-sans text-sm text-[#434654]">
            Seguí el estado de tus estadías y gestioná tus reservas.
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
            key={section.status ?? ALL_STATUSES_KEY}
            status={section.status}
            title={section.title}
            wallet={userWallet}
            role={ROLE}
            checkIn={checkIn}
            onTotalChange={handleTotalChange(section.status)}
          />
        ))}
      </div>
    </div>
  );
}
