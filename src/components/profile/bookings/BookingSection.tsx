"use client";

import type { BookingSectionProps } from "@/types/profile/bookings";
import { EmptyState } from "../EmptyState";
import { BookingListSkeleton } from "./BookingListSkeleton";
import { STATUS_DOT_CLASSES } from "./bookingStatusStyles";
import { HostBookingCard } from "./HostBookingCard";

export function BookingSection({
  status,
  title,
  bookings,
  loading = false,
  emptyMessage,
  emptyDescription,
}: BookingSectionProps) {
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
        {bookings.length > 0 && (
          <span className="rounded-full bg-primary/10 px-2 py-0.5 font-sans text-xs font-semibold text-primary">
            {bookings.length}
          </span>
        )}
      </div>

      {loading ? (
        <BookingListSkeleton />
      ) : bookings.length === 0 ? (
        <EmptyState
          message={emptyMessage ?? "No hay reservas en esta sección."}
          description={emptyDescription}
        />
      ) : (
        <div className="list-stagger space-y-3">
          {bookings.map((booking, i) => (
            <div key={booking.idPda} style={{ animationDelay: `${i * 40}ms` }}>
              <HostBookingCard booking={booking} />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
