"use client";

import type { DisputeListSkeletonProps } from "@/types/profile/disputes";

/** Esqueleto de lista de disputas durante la carga (mismo patrón que reservas). */
export function DisputeListSkeleton({ count = 3 }: DisputeListSkeletonProps) {
  const skeletonKeys = Array.from({ length: count }, () => crypto.randomUUID());

  return (
    <div className="space-y-3">
      {skeletonKeys.map((key) => (
        <article
          key={key}
          className="card-white animate-skeleton-pulse flex flex-col gap-4 p-4 sm:flex-row sm:items-center"
        >
          <div className="size-11 shrink-0 rounded-xl bg-surface" />
          <div className="min-w-0 flex-1 space-y-2.5">
            <div className="flex items-center gap-2">
              <div className="h-4 w-28 rounded-md bg-surface" />
              <div className="h-4 w-20 rounded-full bg-surface" />
            </div>
            <div className="h-3.5 w-2/3 rounded-md bg-surface" />
            <div className="h-3.5 w-1/2 rounded-md bg-surface" />
          </div>
          <div className="h-7 w-24 shrink-0 rounded-full bg-surface" />
        </article>
      ))}
    </div>
  );
}
