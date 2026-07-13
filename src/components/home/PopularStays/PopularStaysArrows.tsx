"use client";

import { BlossomNext, BlossomPrev } from "@blossom-carousel/react";
import { IconNextArrow } from "@/components/Icons/IconNextArrow";
import { IconPrevArrow } from "@/components/Icons/IconPrevArrow";
import type { PopularStaysArrowsProps } from "@/types/SliderTypes";

const arrowButtonClass =
  "flex size-10 items-center justify-center rounded-full disabled:border bg-[#3B007F] text-white transition-colors hover:bg-[#5307AD] disabled:border-zinc-300 disabled:bg-white disabled:text-zinc-700 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer";

export const PopularStaysArrows = ({ sliderId }: PopularStaysArrowsProps) => (
  <>
    <BlossomPrev for={sliderId} className={arrowButtonClass}>
      <IconPrevArrow />
    </BlossomPrev>

    <BlossomNext for={sliderId} className={arrowButtonClass}>
      <IconNextArrow />
    </BlossomNext>
  </>
);
