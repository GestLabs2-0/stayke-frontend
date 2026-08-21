"use client";

import { useEffect } from "react";

import { useBookingsByStatus } from "@/hooks/useBookingsByStatus";
import type { BookingSectionProps } from "@/types/profile/bookings";
import { EmptyState } from "../EmptyState";
import { BookingListSkeleton } from "./BookingListSkeleton";
import { STATUS_DOT_CLASSES } from "./bookingStatusStyles";
import { HostBookingCard } from "./HostBookingCard";

const PAGE_BUTTON =
  "inline-flex cursor-pointer items-center justify-center rounded-full border border-primary/20 bg-primary/5 px-5 py-2 font-plus-jakarta text-[13px] font-semibold text-primary transition-colors hover:bg-primary/10 disabled:cursor-not-allowed disabled:opacity-40";

/**
 * Sección de reservas de un estado: hace su propio fetch paginado y ofrece
 * botones "Anterior"/"Siguiente" para cambiar de página.
 */
export function BookingSection({
  status,
  title,
  host,
  pageSize = 8,
  emptyMessage,
  emptyDescription,
  onTotalChange,
}: BookingSectionProps) {
  const {
    bookings,
    loading,
    page,
    total,
    totalPages,
    hasPrev,
    hasNext,
    goToPage,
    refresh,
  } = useBookingsByStatus(host, status, { pageSize });

  useEffect(() => {
    onTotalChange?.(total);
  }, [total, onTotalChange]);

  return (
    <section className="space-y-3">
      <div className="flex items-center gap-2.5">
        <span
          aria-hidden="true"
          className={`size-2.5 rounded-full ${STATUS_DOT_CLASSES[status]}`}
        />
        <h2 className="font-montserrat text-base font-bold text-foreground">
          {title}
        </h2>
        {total > 0 && (
          <span className="rounded-full bg-primary/10 px-2 py-0.5 font-sans text-xs font-semibold text-primary">
            {total}
          </span>
        )}
      </div>

      {loading && bookings.length === 0 ? (
        <BookingListSkeleton count={pageSize} />
      ) : bookings.length === 0 ? (
        <EmptyState
          message={emptyMessage ?? "No hay reservas en esta sección."}
          description={emptyDescription}
        />
      ) : (
        <div className="space-y-3">
          <div className="list-stagger space-y-3">
            {bookings.map((booking, i) => (
              <div
                key={booking.idPda}
                style={{ animationDelay: `${i * 40}ms` }}
              >
                <HostBookingCard booking={booking} onChanged={refresh} />
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => goToPage(page - 1)}
                disabled={!hasPrev || loading}
                className={PAGE_BUTTON}
              >
                Anterior
              </button>
              <span className="font-sans text-sm font-semibold text-secondary">
                Página {page} de {totalPages}
              </span>
              <button
                type="button"
                onClick={() => goToPage(page + 1)}
                disabled={!hasNext || loading}
                className={PAGE_BUTTON}
              >
                Siguiente
              </button>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
