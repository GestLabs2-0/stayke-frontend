"use client";

import { motion } from "framer-motion";

import type { ListCardSkeletonProps } from "@/types/profile";

export function ListCardSkeleton({ count = 1 }: ListCardSkeletonProps) {
  const skeletonKeys = Array.from({ length: count }, () => crypto.randomUUID());

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="space-y-3"
    >
      {skeletonKeys.map((key) => (
        <div
          key={key}
          className="flex animate-pulse gap-4 rounded-xl border border-[#c3c6d6] bg-white p-4"
        >
          <div className="size-20 shrink-0 rounded-lg bg-surface sm:size-24" />
          <div className="flex min-w-0 flex-1 flex-col justify-center space-y-2">
            <div className="h-4 w-3/5 rounded bg-surface" />
            <div className="h-3 w-2/5 rounded bg-surface" />
            <div className="mt-2 h-3 w-1/3 rounded bg-surface" />
          </div>
        </div>
      ))}
    </motion.div>
  );
}
