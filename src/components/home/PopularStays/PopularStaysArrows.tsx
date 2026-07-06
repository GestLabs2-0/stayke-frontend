"use client";

import { BlossomNext, BlossomPrev } from "@blossom-carousel/react";
import type { PopularStaysArrowsProps } from "@/types/SliderTypes";

const arrowButtonClass =
  "flex size-10 items-center justify-center rounded-full disabled:border bg-[#3B007F] text-white transition-colors hover:bg-[#5307AD] disabled:border-zinc-300 disabled:bg-white disabled:text-zinc-700 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer";

export const PopularStaysArrows = ({ sliderId }: PopularStaysArrowsProps) => (
  <>
    <BlossomPrev for={sliderId} className={arrowButtonClass}>
      <svg
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
        className="size-5"
        aria-hidden="true"
      >
        <polyline points="15 18 9 12 15 6" />
      </svg>
    </BlossomPrev>

    <BlossomNext for={sliderId} className={arrowButtonClass}>
      <svg
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
        className="size-5"
        aria-hidden="true"
      >
        <polyline points="9 18 15 12 9 6" />
      </svg>
    </BlossomNext>
  </>
);
