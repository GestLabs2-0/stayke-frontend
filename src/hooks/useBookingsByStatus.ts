"use client";

import { useCallback, useEffect, useState } from "react";

import { staykeApi } from "@/lib/staykeApi";
import type { Booking, BookingStatus } from "@/types/api/booking";
import type { BookingRole } from "@/types/profile/bookings";

export interface UseBookingsByStatusOptions {
  pageSize?: number;
  /** "host" filtra por reservas del anfitrión; "guest" por las del huésped. */
  role?: BookingRole;
  /** Filtro de fecha: solo reservas con check-in mayor o igual (segundos Unix). */
  checkIn?: number;
  /** Filtro de fecha: solo reservas con check-out menor o igual (segundos Unix). */
  checkOut?: number;
}

/**
 * Carga las reservas de un actor (anfitrión o huésped) para un único `status` con
 * paginación por páginas (`page`/`pageSize`). Expone `goToPage` para navegar y
 * `refresh` para recargar desde la primera página (por ejemplo tras una mutación
 * on-chain).
 */
export function useBookingsByStatus(
  wallet: string | null | undefined,
  status: BookingStatus | null,
  {
    pageSize = 8,
    role = "host",
    checkIn,
    checkOut,
  }: UseBookingsByStatusOptions = {},
) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [refreshKey, setRefreshKey] = useState(0);

  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const hasPrev = page > 1;
  const hasNext = page < totalPages;

  const refresh = useCallback(() => {
    setPage(1);
    setRefreshKey((key) => key + 1);
  }, []);

  const goToPage = useCallback((nextPage: number) => {
    if (nextPage < 1) return;
    setPage(nextPage);
  }, []);

  useEffect(() => {
    let cancelled = false;
    // refreshKey fuer un re-run tras una mutación on-chain.
    void refreshKey;

    if (!wallet) {
      setBookings([]);
      setTotal(0);
      setLoading(false);
      return;
    }

    setLoading(true);
    const offset = (page - 1) * pageSize;

    staykeApi
      .getBookings({
        ...(role === "host" ? { host: wallet } : { guest: wallet }),
        status: status ?? undefined,
        checkIn,
        checkOut,
        limit: pageSize,
        offset,
      })
      .then((result) => {
        if (cancelled) return;
        setBookings(
          result.status && Array.isArray(result.data) ? result.data : [],
        );
        setTotal(result.meta?.total ?? 0);
        setLoading(false);
      })
      .catch(() => {
        if (cancelled) return;
        setBookings([]);
        setTotal(0);
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [wallet, status, pageSize, page, refreshKey, role, checkIn, checkOut]);

  // Si la navegación quedó fuera de rango (p. ej. tras un refresh), se corrige.
  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  return {
    bookings,
    loading,
    page,
    total,
    totalPages,
    hasPrev,
    hasNext,
    goToPage,
    refresh,
  };
}
