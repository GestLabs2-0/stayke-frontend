"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { AmenitiesList } from "@/components/accommodation/AmenitiesList";
import { BookingCard } from "@/components/accommodation/BookingCard";
import { HostInfo } from "@/components/accommodation/HostInfo";
import { PropertyGallery } from "@/components/accommodation/PropertyGallery";
import { PropertyMap } from "@/components/accommodation/PropertyMap";
import { ReviewsSection } from "@/components/accommodation/ReviewsSection";
import { routes } from "@/constants/routes";
import { staykeApi } from "@/lib/staykeApi";
import { PROPERTY_TYPE_LABELS } from "@/types/api/property";
import type { PropertyDetail } from "@/types/api/propertyDetail";

export default function PropertyDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [property, setProperty] = useState<PropertyDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const formattedRules = useMemo(() => {
    try {
      const res = JSON.parse(property?.houseRules ?? "[]") as string[];
      return res;
    } catch {
      return [];
    }
  }, [property]);

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
        <div className="aspect-[4/3] w-full animate-skeleton-pulse rounded-2xl bg-surface md:aspect-video" />
        <div className="mt-8 space-y-4">
          <div className="h-8 w-2/3 animate-skeleton-pulse rounded-lg bg-surface" />
          <div className="h-4 w-1/3 animate-skeleton-pulse rounded-lg bg-surface" />
          <div className="h-32 w-full animate-skeleton-pulse rounded-2xl bg-surface" />
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
          No pudimos cargar este alojamiento.
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

  const {
    title,
    city,
    state,
    countryCode,
    propertyType,
    maxGuest,
    bedrooms,
    bathrooms,
    checkinTime,
    checkoutTime,
    description,
    address,
    latitude,
    longitude,
    price,
  } = property;

  const location = [city, state, countryCode].filter(Boolean).join(", ");
  const chips = [
    `${maxGuest} huéspedes`,
    `${bedrooms} habitaciones`,
    `${bathrooms} baños`,
    `Ingreso ${checkinTime} · Salida ${checkoutTime}`,
  ];

  const scrollToBooking = () => {
    document
      .getElementById("booking-card")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <>
      <div className="mx-auto w-full max-w-6xl px-4 pb-28 pt-11.5 md:pt-14 md:px-6 lg:pb-12">
        <PropertyGallery
          images={property.imageUrl ? [property.imageUrl] : []}
          title={title}
          fallbackLabel={`${PROPERTY_TYPE_LABELS[propertyType]} en ${city}`}
        />

        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div className="min-w-0 space-y-8">
            <header className="border-b border-border pb-6">
              <h1 className="font-montserrat text-3xl font-bold tracking-tight text-zinc-900 md:text-4xl">
                {title}
              </h1>
              <p className="mt-2 text-base text-zinc-500">{location}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {chips.map((chip) => (
                  <span
                    key={chip}
                    className="rounded-full border border-border bg-surface px-3 py-1 text-sm font-medium text-zinc-700 transition-colors hover:border-primary/30 hover:bg-white"
                  >
                    {chip}
                  </span>
                ))}
              </div>
            </header>

            <HostInfo host={property.host} city={city} />

            {description && (
              <section className="card-white">
                <h2 className="font-montserrat text-xl font-bold text-zinc-900">
                  Sobre este lugar
                </h2>
                <p className="mt-4 text-sm leading-relaxed text-zinc-700">
                  {description}
                </p>
                {formattedRules.length > 0 && (
                  <div className="mt-4 border-t border-border pt-4 text-sm">
                    <p className="text-lg font-bold text-zinc-900">
                      Reglas de la casa:{" "}
                    </p>
                    <ul className="mt-3 list-disc pl-5 text-zinc-700">
                      {formattedRules.map((rule) => (
                        <li key={rule}>{rule}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </section>
            )}

            <AmenitiesList amenities={property.amenities} />

            <PropertyMap
              latitude={latitude}
              longitude={longitude}
              address={address}
              city={city}
            />

            <ReviewsSection reviews={property.reviews} />
          </div>

          <aside
            id="booking-card"
            className="lg:sticky lg:top-24 lg:self-start"
          >
            <BookingCard price={price} maxGuest={maxGuest} />
          </aside>
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border z-1001 bg-white px-4 py-3 shadow-[0_-4px_12px_rgba(0,0,0,0.06)] lg:hidden">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="font-montserrat text-lg font-bold text-zinc-900">
              {price.toLocaleString("es-CO")} $
            </p>
            <p className="text-xs text-zinc-500">por noche</p>
          </div>
          <button
            type="button"
            onClick={scrollToBooking}
            className="rounded-xl bg-primary px-6 py-3 font-semibold text-white transition-colors hover:bg-primary-hover"
          >
            Reservar
          </button>
        </div>
      </div>
    </>
  );
}
