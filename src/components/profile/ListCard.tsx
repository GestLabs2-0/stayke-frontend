"use client";

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
    <div
      className={`flex gap-4 rounded-xl p-4 transition-colors ${
        active
          ? "bg-white hover:bg-[#ebe7e7]/40 border border-[#c3c6d6]"
          : "bg-[#ebe7e7] opacity-70 border border-[#ebe7e7]"
      }`}
    >
      <div className="size-20 shrink-0 overflow-hidden rounded-lg sm:size-24">
        <Image
          src={image}
          alt={title}
          width={96}
          height={96}
          className="size-full object-cover"
          unoptimized
        />
      </div>
      <div className="flex min-w-0 flex-1 flex-col justify-center">
        <h3 className="truncate font-sans text-sm font-semibold text-[#171717]">
          {title}
        </h3>
        {subtitle && (
          <p className="mt-0.5 truncate font-sans text-xs text-[#434654]">
            {subtitle}
          </p>
        )}
        {children && <div className="mt-2">{children}</div>}
      </div>
    </div>
  );
}
