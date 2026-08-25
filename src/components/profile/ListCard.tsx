"use client";

import { motion } from "framer-motion";
import Image from "next/image";

import type { ListCardProps } from "@/types/profile";

export function ListCard({
  image,
  title,
  subtitle,
  children,
  active = true,
}: ListCardProps) {
  return (
    <motion.div
      whileHover={
        active
          ? {
              y: -2,
              transition: { duration: 0.2, ease: [0.16, 1, 0.3, 1] },
            }
          : undefined
      }
      className={`group flex gap-4 rounded-xl p-4 transition-colors duration-200 ${
        active
          ? "border border-[#c3c6d6] bg-white hover:border-[#3b007f]/30 hover:bg-[#ebe7e7]/30 hover:shadow-sm"
          : "border border-[#ebe7e7] bg-[#ebe7e7] opacity-75"
      }`}
    >
      <div className="size-20 shrink-0 overflow-hidden rounded-lg sm:size-24">
        <Image
          src={image}
          alt={title}
          width={96}
          height={96}
          className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
          unoptimized
        />
      </div>
      <div className="flex min-w-0 flex-1 flex-col justify-center">
        <h3 className="truncate font-sans text-sm font-semibold text-[#171717] transition-colors group-hover:text-[#3b007f]">
          {title}
        </h3>
        {subtitle && (
          <p className="mt-0.5 truncate font-sans text-xs text-[#434654]">
            {subtitle}
          </p>
        )}
        {children && <div className="mt-2">{children}</div>}
      </div>
    </motion.div>
  );
}
