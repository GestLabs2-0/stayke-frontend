"use client";

import { useEffect, useState } from "react";

import { staykeApi } from "@/lib/staykeApi";
import type { Booking, BookingStatus } from "@/types/api/booking";

/** Máximo que el backend devuelve por request (límite de la API). */
const BOOKINGS_FETCH_LIMIT = 100;

interface UseHostBookingsResult {
  bookings: Booking[];
  loading: boolean;
}

/**
 * Carga las reservas del anfitrión desde GET /api/v1.0/bookings.
 * Al pasar `status` el backend filtra por ese estado; si es `null` se
 * obtienen todas las reservas del anfitrión.
 */
export function useHostBookings(
  host: string | null | undefined,
  status: BookingStatus | null,
): UseHostBookingsResult {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    if (!host) {
      setBookings([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    staykeApi
      .getBookings({
        host,
        status: status ?? undefined,
        limit: BOOKINGS_FETCH_LIMIT,
      })
      .then((result) => {
        if (cancelled) return;
        setBookings(
          result.status && Array.isArray(result.data) ? result.data : [],
        );
        setLoading(false);
      })
      .catch(() => {
        if (cancelled) return;
        setBookings([]);
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [host, status]);

  return { bookings, loading };
}
