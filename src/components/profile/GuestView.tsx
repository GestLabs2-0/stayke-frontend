"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { BookingStatus } from "@GestLabs2-0/stayke-escrow";
import { routes } from "@/constants/routes";
import { useWalletContext } from "@/hooks/useWallet";
import { staykeApi } from "@/lib/staykeApi";
import type { Booking } from "@/types/api/booking";
import type { GuestViewProps } from "@/types/profile";
import { GuestActiveReservation } from "./GuestActiveReservation";
import { GuestPastReservations } from "./GuestPastReservations";

export function GuestView({ reservations }: GuestViewProps) {
  const router = useRouter();
  const { userProfile, isLoadingUser } = useWalletContext();
  const [activeBooking, setActiveBooking] = useState<Booking | null>(null);
  const [pastBookings, setPastBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    if (reservations !== undefined) {
      setLoading(false);
      return;
    }

    if (isLoadingUser) return;

    if (!userProfile?.address) {
      setActiveBooking(null);
      setPastBookings([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    Promise.all([
      staykeApi.getBookings({
        guest: userProfile.address,
        status: BookingStatus.Active,
        limit: 1,
      }),
      staykeApi.getBookings({
        guest: userProfile.address,
        limit: 10,
      }),
    ])
      .then(([activeRes, allRes]) => {
        if (cancelled) return;
        const activeItem =
          activeRes.status && Array.isArray(activeRes.data) && activeRes.data[0]
            ? activeRes.data[0]
            : null;
        setActiveBooking(activeItem);

        const allList =
          allRes.status && Array.isArray(allRes.data) ? allRes.data : [];
        const pastList = allList
          .filter((b) => b.status !== BookingStatus.Active)
          .slice(0, 2);

        setPastBookings(pastList);
        setLoading(false);
      })
      .catch(() => {
        if (cancelled) return;
        setActiveBooking(null);
        setPastBookings([]);
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [userProfile?.address, isLoadingUser, reservations]);

  const handleExplore = () => {
    router.push(routes.Destinys);
  };

  return (
    <div className="space-y-6">
      <GuestActiveReservation
        booking={activeBooking}
        loading={loading}
        onExplore={handleExplore}
      />
      <GuestPastReservations
        bookings={pastBookings}
        loading={loading}
        onExplore={handleExplore}
      />
    </div>
  );
}
