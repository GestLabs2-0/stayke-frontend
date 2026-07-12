"use client";

import Image from "next/image";
import { useState } from "react";
import { HeartIcon } from "@/icons";
import type { PropertyCardProps } from "@/types/property-cards";

export const PropertyCard = ({
  property,
  className = "",
  expandImage = false,
}: PropertyCardProps) => {
  const [isLiked, setIsLiked] = useState(property.isLiked ?? false);

  return (
    <article className={`group flex h-full flex-col gap-3 ${className}`}>
      {/* Imagen de la card */}
      <div
        className={`relative w-full overflow-hidden rounded-2xl bg-zinc-100 ${
          expandImage ? "flex-1 min-h-0" : ""
        }`}
        style={
          expandImage ? {} : { aspectRatio: "var(--card-aspect, 737/398)" }
        }
      >
        <Image
          src={property.imageUrl}
          alt={property.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />

        {/* Botón del corazón */}
        <button
          type="button"
          onClick={() => setIsLiked((prev) => !prev)}
          className="absolute top-3 right-3 flex size-9 items-center justify-center rounded-full bg-white/90 shadow-sm transition-colors hover:bg-white"
          aria-label={isLiked ? "Quitar de favoritos" : "Agregar a favoritos"}
        >
          <HeartIcon
            filled={isLiked}
            className={`size-5 transition-colors cursor-pointer ${
              isLiked ? "text-red-500" : "text-zinc-800"
            }`}
          />
        </button>

        {/* Badge de rating */}
        <div className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1 shadow-sm backdrop-blur-sm">
          <div className="flex items-center">
            <span className="text-xs font-semibold text-white bg-purple-600 px-2 py-0.5 rounded-sm">
              {property.rating.toFixed(1).replace(".", ",")}
            </span>
          </div>
          <span className="text-xs font-semibold text-zinc-700">
            {property.ratingLabel}
          </span>
        </div>
      </div>

      {/* Info de la propiedad */}
      <div className="flex flex-col gap-1">
        <h4 className="text-xl font-semibold text-zinc-900 leading-tight">
          {property.title}
        </h4>
        <p className="text-base text-zinc-500">{property.location}</p>
        <p className="mt-1">
          <span className="text-2xl font-bold text-zinc-900">
            {property.price.toLocaleString("es-CO")} $
          </span>
          <span className="ml-1 text-sm text-zinc-500">
            {property.priceLabel}
          </span>
        </p>
      </div>
    </article>
  );
};
