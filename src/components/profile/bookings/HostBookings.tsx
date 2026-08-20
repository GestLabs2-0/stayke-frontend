"use client";

import { CalendarDays } from "lucide-react";
import { useState } from "react";

import { useHostBookings } from "@/hooks/useHostBookings";
import { useWalletContext } from "@/hooks/useWallet";
import type { BookingStatusFilter } from "@/types/profile/bookings";
import { Breadcrumb } from "../Breadcrumb";
import { EmptyState } from "../EmptyState";
import { BookingListSkeleton } from "./BookingListSkeleton";
import { HostBookingCard } from "./HostBookingCard";

export function HostBookings() {
  const { userWallet } = useWalletContext();
  const [status] = useState<BookingStatusFilter>(null);
  const { bookings, loading } = useHostBookings(userWallet, status);

  const isEmpty = !loading && bookings.length === 0;

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

      {loading ? (
        <BookingListSkeleton />
      ) : isEmpty ? (
        <EmptyState
          message="No tenés reservas todavía."
          description="Cuando un huésped reserve un alojamiento, aparecerá acá."
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
    </div>
  );
}
