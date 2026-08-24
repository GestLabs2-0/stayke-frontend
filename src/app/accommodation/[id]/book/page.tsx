"use client";

import { address, isAddress } from "@solana/kit";
import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { sileo } from "sileo";

import { BookingForm } from "@/components/accommodation/BookingForm";
import { PropertyGallery } from "@/components/accommodation/PropertyGallery";
import { routes } from "@/constants/routes";
import { useCreateBooking } from "@/hooks/contracts/useCreateBooking";
import { useWalletContext } from "@/hooks/useWallet";
import { staykeApi } from "@/lib/staykeApi";
import type { PropertyDetail } from "@/types/api/propertyDetail";

const parseDateParam = (value: string | null) => {
  if (!value) return null;
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return null;
  const [, year, month, day] = match;
  const date = new Date(Number(year), Number(month) - 1, Number(day));
  return Number.isNaN(date.getTime()) ? null : date;
};

export default function BookPage() {
  const { id } = useParams<{ id: string }>();
  const searchParams = useSearchParams();

  const [property, setProperty] = useState<PropertyDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const router = useRouter();
  const { userWallet } = useWalletContext();

  const propertyAddress = useMemo(
    () => (property && isAddress(property.pda) ? address(property.pda) : null),
    [property],
  );
  const hostWallet = useMemo(
    () =>
      property && isAddress(property.host.owner)
        ? address(property.host.owner)
        : null,
    [property],
  );

  const { createBooking, loading: submitting } = useCreateBooking({
    property: propertyAddress,
    hostWallet,
  });

  const initialCheckIn = useMemo(
    () => parseDateParam(searchParams.get("checkIn")),
    [searchParams],
  );
  const initialCheckOut = useMemo(
    () => parseDateParam(searchParams.get("checkOut")),
    [searchParams],
  );

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(false);

    staykeApi
      .getPropertyById(id)
      .then((result) => {
        if (cancelled) return;
        if (result.status && result.data) {
          setProperty(result.data);
        } else {
          setError(true);
        }
      })
      .catch(() => {
        if (!cancelled) setError(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="mx-auto w-full max-w-6xl px-4 py-12 md:px-6">
        <div className="aspect-4/3 w-full animate-skeleton-pulse rounded-2xl bg-surface md:aspect-video" />
        <div className="mt-8 space-y-4">
          <div className="h-8 w-2/3 animate-skeleton-pulse rounded-lg bg-surface" />
          <div className="h-32 w-full animate-skeleton-pulse rounded-2xl bg-surface" />
        </div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-center px-4 py-24 text-center md:px-6">
        <h1 className="text-2xl font-bold text-zinc-900">
          Alojamiento no encontrado
        </h1>
        <p className="mt-2 text-sm text-zinc-500">
          No pudimos cargar este alojamiento para reservarlo.
        </p>
        <Link
          href={routes.Home}
          className="mt-6 rounded-xl bg-primary px-6 py-3 font-semibold text-white transition-colors hover:bg-primary-hover"
        >
          Volver al inicio
        </Link>
      </div>
    );
  }

  const location = [property.city, property.state, property.countryCode]
    .filter(Boolean)
    .join(", ");

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 md:px-6">
      <Link
        href={`${routes.Accommodation}/${property.pda}`}
        className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-zinc-500 transition-colors hover:text-primary"
      >
        ← Volver
      </Link>

      <PropertyGallery
        images={property.imageUrl ? [property.imageUrl] : []}
        title={property.title}
        fallbackLabel={`${property.title} · ${location}`}
      />

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_420px]">
        <section className="space-y-6">
          <header className="border-b border-border pb-6">
            <h1 className="font-montserrat text-2xl font-bold tracking-tight text-zinc-900 md:text-3xl">
              Confirma tu reserva
            </h1>
            <p className="mt-2 text-base text-zinc-500">
              {property.title} · {location}
            </p>
            <p className="mt-3 text-sm text-zinc-600">
              {formatHost(property.host.name, property.host.lastName)} anfitrión
              {property.host.isVerified ? " verificado" : ""}
            </p>
          </header>
          <p className="text-sm leading-relaxed text-zinc-600">
            Revisa las fechas y el número de huéspedes antes de confirmar. Las
            fechas tachadas ya están reservadas y no están disponibles.
          </p>
        </section>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <BookingForm
            price={property.price}
            maxGuest={property.maxGuest}
            property={propertyAddress ?? undefined}
            initialCheckIn={initialCheckIn}
            initialCheckOut={initialCheckOut}
            submitting={submitting}
            submitLabel={submitting ? "Confirmando..." : "Confirmar reserva"}
            onSubmit={async (selection) => {
              if (!selection.checkIn || !selection.checkOut) return;
              if (!userWallet) {
                router.push(routes.Register);
                return;
              }
              const result = await createBooking({
                checkIn: selection.checkIn,
                checkOut: selection.checkOut,
              });
              if (result.status) {
                sileo.success({ title: "Reserva enviada a la cadena" });
                router.push(routes.Profile.bookings.index);
              }
            }}
          />
        </aside>
      </div>
    </div>
  );
}

function formatHost(name: string, lastName?: string) {
  return [name, lastName].filter(Boolean).join(" ").trim() || "Tu";
}
