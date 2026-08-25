"use client";

import type { BookingListSkeletonProps } from "@/types/profile/bookings";

export function BookingListSkeleton({ count = 3 }: BookingListSkeletonProps) {
  const skeletonKeys = Array.from({ length: count }, () => crypto.randomUUID());

  return (
    <div className="space-y-3">
      {skeletonKeys.map((key) => (
        <article
          key={key}
          className="card-white animate-skeleton-pulse flex flex-col gap-4 p-4 sm:flex-row sm:items-center"
        >
          <div className="min-w-0 flex-1 space-y-2.5">
            <div className="h-4 w-1/3 rounded-md bg-surface" />
            <div className="h-3.5 w-2/3 rounded-md bg-surface" />
            <div className="h-3.5 w-1/2 rounded-md bg-surface" />
          </div>
          <div className="h-7 w-28 shrink-0 rounded-full bg-surface" />
        </article>
      ))}
    </div>
  );
}
