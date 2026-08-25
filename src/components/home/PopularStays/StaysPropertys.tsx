"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { HeartIcon, StarIcon } from "@/icons";
import type { StaysPropertysProps } from "@/types/SliderTypes";

export const StaysPropertys = ({ property }: StaysPropertysProps) => {
  const [isLiked, setIsLiked] = useState(property.isLiked ?? false);

  return (
    <motion.article
      whileHover={{ y: -4 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      className="h-full rounded-2xl bg-white p-2 shadow-sm transition-all duration-300 hover:shadow-[0_12px_28px_rgba(59,0,127,0.08)] border border-zinc-100/80"
    >
      <Link
        href={`${property.href}`}
        className="group flex h-full flex-col gap-2.5 select-none"
        draggable={false}
      >
        {/* Image Container */}
        <div className="relative w-full aspect-4/3 overflow-hidden rounded-xl bg-zinc-100">
          <Image
            src={property.imageUrl}
            alt={property.title}
            fill
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-105 select-none pointer-events-none"
            sizes="(max-width: 768px) 70vw, (max-width: 1200px) calc(100vw/3.5), calc(100vw/4.5)"
            draggable={false}
          />

          {/* Top Overlays: Badge & Heart */}
          <div className="pointer-events-none absolute inset-x-2.5 top-2.5 flex items-center justify-between z-10">
            {property.excepcional ? (
              <span className="text-[10px] leading-tight text-white font-bold bg-[#3b007f]/90 rounded-full px-2.5 py-1 backdrop-blur-md truncate max-w-[65%] shadow-sm">
                Favorito de huéspedes
              </span>
            ) : (
              <span />
            )}

            <motion.button
              type="button"
              whileHover={{ scale: 1.12 }}
              whileTap={{ scale: 0.82 }}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsLiked((prev) => !prev);
              }}
              className="pointer-events-auto flex size-8 shrink-0 items-center justify-center rounded-full bg-white/90 shadow-sm backdrop-blur-sm transition-colors hover:bg-white cursor-pointer"
              aria-label={
                isLiked ? "Quitar de favoritos" : "Agregar a favoritos"
              }
            >
              <HeartIcon
                filled={isLiked}
                className={`size-4.5 transition-colors ${
                  isLiked ? "text-rose-500 fill-rose-500" : "text-zinc-700"
                }`}
              />
            </motion.button>
          </div>
        </div>

        {/* Info */}
        <div className="flex flex-col gap-1 px-1 pb-1">
          {/* Title + rating */}
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-sm font-bold font-montserrat text-zinc-800 leading-tight truncate group-hover:text-[#3b007f] transition-colors">
              {property.title} · {property.location.split(",")[0]}
            </h3>
            {property.rating != null && (
              <div className="flex items-center gap-1 shrink-0">
                <StarIcon className="size-3.5 text-amber-500 fill-amber-400" />
                <span className="text-xs font-bold text-zinc-900">
                  {property.rating.toFixed(1)}
                </span>
              </div>
            )}
          </div>

          {/* Price */}
          <p className="text-sm font-bold text-zinc-900 font-montserrat">
            {property.price.toLocaleString("es-CO")} ${" "}
            <span className="text-xs font-semibold text-zinc-500">
              {property.priceLabel}
            </span>
          </p>
        </div>
      </Link>
    </motion.article>
  );
};
