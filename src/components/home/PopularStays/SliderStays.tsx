"use client";

import { BlossomCarousel } from "@blossom-carousel/react";
import { Children } from "react";
import type { SliderStaysProps } from "@/types/SliderStaysProps";

export const SLIDER_ID = "popular-stays-slider";

export const SliderStays = ({ children }: SliderStaysProps) => {
  return (
    <BlossomCarousel id={SLIDER_ID} className="[scroll-snap-type:x_mandatory]">
      {Children.map(children, (child) => (
        <div
          data-blossom-slide
          className="w-[70%] md:w-[calc(100%/3.5)] lg:w-[calc(100%/4.5)] pr-3 snap-start"
        >
          {child}
        </div>
      ))}
    </BlossomCarousel>
  );
};
