"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef } from "react";

import { formatPrice } from "@/helpers/formatPrice";
import { HomeIcon } from "@/icons/HomeIcon";
import { LocationIcon } from "@/icons/LocationIcon";
import { XIcon } from "@/icons/XIcon";
import type { CreatePropertyFormValues } from "@/types/property/createProperty";
import type { PropertyPreviewProps } from "@/types/property/PropertyPreview";

function hasNoData(values: CreatePropertyFormValues): boolean {
  return (
    !values.title &&
    !values.description &&
    !values.address &&
    values.images.length === 0 &&
    values.amenities.length === 0 &&
    values.houseRules.length === 0 &&
    values.price === 0 &&
    values.maxGuest === 0
  );
}

export function PropertyPreview({
  open,
  onClose,
  values,
}: PropertyPreviewProps) {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [open, onClose]);

  const heroUrl = useMemo(() => {
    if (values.images.length === 0) return null;
    return URL.createObjectURL(values.images[0]);
  }, [values.images]);

  useEffect(() => {
    return () => {
      if (heroUrl) URL.revokeObjectURL(heroUrl);
    };
  }, [heroUrl]);

  if (!open || hasNoData(values)) return null;

  const visibleAmenities = values.amenities.slice(0, 4);
  const extraAmenities = values.amenities.length - 4;
  const visibleRules = values.houseRules.slice(0, 4);
  const extraRules = values.houseRules.length - 4;

  return (
    // biome-ignore lint/a11y/noStaticElementInteractions: is allowed
    // biome-ignore lint/a11y/useKeyWithClickEvents: this is ok
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onClick={(e) => {
        if (e.target === overlayRef.current) onClose();
      }}
    >
      <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-xl animate-in fade-in zoom-in-95 duration-200">
        <button
          type="button"
          onClick={onClose}
          aria-label="Cerrar"
          className="absolute right-4 top-4 z-10 flex size-8 items-center justify-center rounded-full bg-white/80 text-muted transition-colors hover:bg-white hover:text-foreground"
        >
          <XIcon />
        </button>

        {heroUrl ? (
          <Image
            width={100}
            height={100}
            src={heroUrl}
            alt={values.title}
            className="w-full aspect-video object-cover rounded-t-2xl"
          />
        ) : (
          <div className="w-full aspect-video bg-surface rounded-t-2xl flex flex-col items-center justify-center gap-2 text-muted">
            <HomeIcon />
            <span className="font-sans text-sm">Sin fotos</span>
          </div>
        )}

        <div className="p-5 space-y-4">
          {values.title && (
            <h3 className="font-montserrat text-lg font-bold text-foreground">
              {values.title}
            </h3>
          )}

          {values.address && (
            <div className="flex items-start gap-1.5 text-sm text-secondary">
              <span className="mt-0.5 shrink-0 size-4">
                <LocationIcon />
              </span>
              <span>{values.address}</span>
            </div>
          )}

          {values.description && (
            <p className="font-sans text-sm text-secondary line-clamp-3">
              {values.description}
            </p>
          )}

          <div>
            <span className="font-montserrat text-2xl font-bold text-foreground">
              {formatPrice(values.price)}
            </span>
            <span className="font-sans text-sm text-muted"> /noche</span>
          </div>

          {values.maxGuest > 0 && (
            <p className="font-sans text-sm text-secondary">
              {values.maxGuest}{" "}
              {values.maxGuest === 1 ? "huésped" : "huéspedes"}
            </p>
          )}

          {(values.checkinTime || values.checkoutTime) && (
            <p className="font-sans text-sm text-secondary">
              Check-in: {values.checkinTime || "—"}
              {values.checkoutTime
                ? ` \u2022 Check-out: ${values.checkoutTime}`
                : ""}
            </p>
          )}

          {values.amenities.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {visibleAmenities.map((amenity) => (
                <span
                  key={amenity}
                  className="rounded-full bg-primary/5 text-primary text-[12px] px-3 py-1"
                >
                  {amenity}
                </span>
              ))}
              {extraAmenities > 0 && (
                <span className="rounded-full bg-primary/5 text-primary text-[12px] px-3 py-1">
                  +{extraAmenities} m&aacute;s
                </span>
              )}
            </div>
          )}

          {values.houseRules.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {visibleRules.map((rule) => (
                <span
                  key={rule}
                  className="rounded-full bg-amber-50 text-amber-800 text-[12px] px-3 py-1"
                >
                  {rule}
                </span>
              ))}
              {extraRules > 0 && (
                <span className="rounded-full bg-amber-50 text-amber-800 text-[12px] px-3 py-1">
                  +{extraRules} m&aacute;s
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
