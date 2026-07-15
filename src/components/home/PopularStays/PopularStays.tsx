"use client";

import dynamic from "next/dynamic";

import { SectionWrapper } from "@/components/shared/SectionWrapper";
import type { PopularStaysProps } from "@/types/SliderTypes";

const PopularStaysSlider = dynamic(
  () => import("./PopularStaysSlider").then((mod) => mod.PopularStaysSlider),
  { ssr: false },
);

export const PopularStays = ({ title, properties }: PopularStaysProps) => {
  if (properties.length === 0) return <div />;

  return (
    <SectionWrapper ariaLabel={title}>
      <PopularStaysSlider title={title} properties={properties} />
    </SectionWrapper>
  );
};
