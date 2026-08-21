"use client";

import { GuestBookings } from "@/components/profile/bookings/GuestBookings";
import { HostBookings } from "@/components/profile/bookings/HostBookings";
import { useProfile } from "@/hooks/useProfile";

export default function BookingsPage() {
  const { mode } = useProfile();

  return mode === "host" ? <HostBookings /> : <GuestBookings />;
}
