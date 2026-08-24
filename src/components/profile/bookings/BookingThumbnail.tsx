"use client";

import { Home } from "lucide-react";
import Image from "next/image";

interface BookingThumbnailProps {
  imageSrc?: string;
  title: string;
}

/** Miniatura de la propiedad; muestra un placeholder si no hay imagen. */
export function BookingThumbnail({ imageSrc, title }: BookingThumbnailProps) {
  return (
    <div className="relative size-24 shrink-0 overflow-hidden rounded-xl bg-surface md:size-28">
      {imageSrc ? (
        <Image
          src={imageSrc}
          alt={title}
          fill
          sizes="112px"
          className="object-cover"
        />
      ) : (
        <div className="flex size-full items-center justify-center text-muted">
          <Home className="size-8" />
        </div>
      )}
    </div>
  );
}
