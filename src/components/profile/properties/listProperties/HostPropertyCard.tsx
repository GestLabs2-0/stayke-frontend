"use client";

import { CalendarCheck, MapPin, Pencil, Power, Star } from "lucide-react";
import Image from "next/image";

import { formatPrice } from "@/helpers/formatPrice";
import type { HostPropertyCardProps } from "@/types/property/HostProperties";

export function HostPropertyCard({
  property,
  onEdit,
  onToggleActive,
}: HostPropertyCardProps) {
  const reviewLabel = `${property.reviews ?? 0} ${
    (property.reviews ?? 0) === 1 ? "reseña" : "reseñas"
  }`;
  const bookingLabel = `${property.bookingsCompleted ?? 0} ${
    (property.bookingsCompleted ?? 0) === 1 ? "reserva" : "reservas"
  }`;

  return (
    <article className="card-white flex flex-col gap-4 p-4 sm:flex-row sm:items-center">
      <div className="relative size-24 shrink-0 overflow-hidden rounded-xl md:size-28">
        {property.imageUrl ? (
          <Image
            src={property.imageUrl}
            alt={property.title}
            fill
            className="object-cover"
            sizes="112px"
          />
        ) : (
          <div className="flex size-full items-center justify-center bg-surface text-[#a0a5b5]">
            <MapPin className="size-8" />
          </div>
        )}
      </div>

      <div className="min-w-0 flex-1 space-y-2">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <h3 className="font-montserrat text-[16px] font-bold text-[#171717]">
            {property.title}
          </h3>
          <span
            className={`inline-block rounded-full px-2 py-0.5 font-sans text-xs font-semibold tracking-wide uppercase ${
              property.isActive
                ? "bg-green-100 text-green-700"
                : "bg-[#ebe7e7] text-[#a0a5b5]"
            }`}
          >
            {property.isActive ? "Activa" : "Inactiva"}
          </span>
        </div>

        <p className="flex items-start gap-1.5 font-sans text-sm text-[#434654]">
          <MapPin className="mt-0.5 size-4 shrink-0" />
          <span>{property.address}</span>
        </p>

        <div className="flex flex-wrap items-center gap-x-5 gap-y-1 font-sans text-[13px] text-[#434654]">
          {(property.reviews ?? 0) > 0 && (
            <span className="inline-flex items-center gap-1.5">
              <Star className="size-4 text-accent-warm" />
              {reviewLabel}
            </span>
          )}
          {(property.bookingsCompleted ?? 0) > 0 && (
            <span className="inline-flex items-center gap-1.5">
              <CalendarCheck className="size-4 text-accent-warm" />
              {bookingLabel}
            </span>
          )}
        </div>

        <p className="font-sans">
          <span className="font-montserrat text-xl font-bold text-[#171717]">
            {formatPrice(property.price)}
          </span>
          <span className="ml-1 text-sm text-[#a0a5b5]">/noche</span>
        </p>
      </div>

      <div className="flex shrink-0 items-center gap-2 sm:flex-col">
        <button
          type="button"
          onClick={() => onEdit(property)}
          aria-label={`Editar ${property.title}`}
          className="inline-flex items-center justify-center gap-1.5 rounded-full border border-[#c3c6d6] bg-white px-4 py-2 font-plus-jakarta text-[13px] font-semibold text-[#434654] transition-colors hover:bg-[#ebe7e7]"
        >
          <Pencil className="size-4" />
          Editar
        </button>
        <button
          type="button"
          onClick={() => onToggleActive(property)}
          className={`inline-flex items-center justify-center gap-1.5 rounded-full px-4 py-2 font-plus-jakarta text-[13px] font-semibold transition-colors ${
            property.isActive
              ? "border border-red-200 bg-white text-red-600 hover:bg-red-50"
              : "bg-[#3b007f] text-white hover:bg-[#5307ad]"
          }`}
        >
          <Power className="size-4" />
          {property.isActive ? "Desactivar" : "Activar"}
        </button>
      </div>
    </article>
  );
}
