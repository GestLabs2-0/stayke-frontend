"use client";

import { BlossomCarousel } from "@blossom-carousel/react";
import type { PropertyCard as PropertyCardType } from "@/types/property-cards";
import { PopularStaysArrows } from "./PopularStaysArrows";
import { SectionHeader } from "./SectionHeader";
import { StaysPropertys } from "./StaysPropertys";

type PopularStaysSliderProps = {
  title: string;
  properties: PropertyCardType[];
};

export const PopularStaysSlider = ({
  title,
  properties,
}: PopularStaysSliderProps) => {
  if (properties.length === 0) return null;

  const sliderId = `popular-stays-${title.toLowerCase().replace(/\s+/g, "-")}`;

  return (
    <>
      <SectionHeader title={title}>
        <PopularStaysArrows sliderId={sliderId} />
      </SectionHeader>

      <div className="mt-6">
        <BlossomCarousel
          id={sliderId}
          className="[scroll-snap-type:x_mandatory]"
          suppressHydrationWarning
        >
          {properties.map((property) => (
            <div
              key={property.id}
              data-blossom-slide
              className="w-[70%] md:w-[calc(100%/3.5)] lg:w-[calc(100%/4.5)] pr-3 snap-start"
            >
              <StaysPropertys property={property} />
            </div>
          ))}
        </BlossomCarousel>
      </div>
    </>
  );
};
