"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { HeartIcon } from "@/icons";
import type { PropertyCard } from "@/types/property-cards";

type StaysPropertysProps = {
  property: PropertyCard;
};

export const StaysPropertys = ({ property }: StaysPropertysProps) => {
  const [isLiked, setIsLiked] = useState(property.isLiked ?? false);

  return (
    <Link
      href={property.href ?? "#"}
      className="group flex h-full flex-col gap-3 select-none"
      draggable={false}
    >
      {/* Imagen */}
      <div className="relative w-full aspect-4/3 overflow-hidden rounded-xl bg-zinc-100">
        <Image
          src={property.imageUrl}
          alt={property.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105 select-none pointer-events-none"
          sizes="(max-width: 768px) 70vw, (max-width: 1200px) calc(100vw/3.5), calc(100vw/4.5)"
          draggable={false}
        />

        {/* Badge + corazón */}
        <div className="pointer-events-none absolute inset-x-3 top-3 flex items-center z-10">
          {property.excepcional && (
            <span className="text-[10px] leading-tight text-white font-medium bg-[#3B007F]  rounded-full px-2 py-0.5 backdrop-blur-sm truncate max-w-[60%] select-none">
              Favorito entre los huéspedes
            </span>
          )}

          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsLiked((prev) => !prev);
            }}
            className="pointer-events-auto ml-auto flex size-8 shrink-0 items-center justify-center rounded-full cursor-pointer"
            aria-label={isLiked ? "Quitar de favoritos" : "Agregar a favoritos"}
          >
            <HeartIcon
              filled={isLiked}
              className={`size-5 transition-colors drop-shadow-sm ${
                isLiked ? "text-[#3B007F]" : "text-black"
              }`}
            />
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="flex flex-col gap-1 px-0.5">
        {/* Descripción + puntuación */}
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-xs font-semibold text-zinc-700 leading-tight truncate">
            {property.title} · {property.location.split(",")[0]}
          </h3>
          <div className="flex items-center gap-1 shrink-0">
            <svg
              className="size-3 text-black"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
              viewBox="0 0 20 20"
              aria-hidden="true"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="text-xs font-semibold text-zinc-900">
              {property.rating.toFixed(1)}
            </span>
          </div>
        </div>

        {/* Precio */}
        <p className="text-sm font-bold text-zinc-900">
          {property.price.toLocaleString("es-CO")} ${" "}
          <span className="text-sm font-bold text-zinc-900">
            {property.priceLabel}
          </span>
        </p>
      </div>
    </Link>
  );
};
