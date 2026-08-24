"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
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
    <motion.article
      whileHover={{ y: -4 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      className={`group rounded-2xl bg-white p-2.5 shadow-sm transition-all duration-300 hover:shadow-[0_14px_30px_rgba(59,0,127,0.08)] border border-zinc-100 flex h-full flex-col cursor-pointer ${className}`}
    >
      <Link
        href={`${property.href}`}
        className="group flex h-full flex-col gap-3.5 select-none"
        draggable={false}
      >
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
            fill={true}
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />

          {/* Botón de favoritos con micro-animación */}
          <motion.button
            type="button"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.85 }}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsLiked((prev) => !prev);
            }}
            className="absolute top-3 right-3 flex size-9.5 items-center justify-center rounded-full bg-white/90 shadow-md backdrop-blur-sm transition-colors hover:bg-white cursor-pointer z-10"
            aria-label={isLiked ? "Quitar de favoritos" : "Agregar a favoritos"}
          >
            <HeartIcon
              filled={isLiked}
              className={`size-5 transition-colors ${
                isLiked ? "text-rose-500 fill-rose-500" : "text-zinc-700"
              }`}
            />
          </motion.button>

          {/* Badge de rating */}
          {property.rating != null && (
            <div className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 shadow-md backdrop-blur-md border border-white/60">
              <span className="text-xs font-bold text-white bg-[#3b007f] px-2 py-0.5 rounded-full">
                {property.rating.toFixed(1).replace(".", ",")}
              </span>
              {property.ratingLabel && (
                <span className="text-xs font-bold text-zinc-800">
                  {property.ratingLabel}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Info de la propiedad */}
        <div className="flex flex-col gap-1.5 px-2 pb-1.5">
          <h4 className="text-lg font-bold font-montserrat text-zinc-900 leading-snug group-hover:text-[#3b007f] transition-colors truncate">
            {property.title}
          </h4>
          <p className="text-sm font-medium text-zinc-500 truncate">
            {property.location}
          </p>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="text-2xl font-extrabold text-zinc-900">
              {property.price.toLocaleString("es-CO")} $
            </span>
            <span className="text-xs font-semibold text-zinc-500">
              {property.priceLabel}
            </span>
          </div>
        </div>
      </Link>
    </motion.article>
  );
};
