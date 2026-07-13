"use client";

import dynamic from "next/dynamic";
import type { PopularStaysProps } from "@/types/SliderTypes";

const PopularStaysSlider = dynamic(
  () => import("./PopularStaysSlider").then((mod) => mod.PopularStaysSlider),
  { ssr: false },
);

export const PopularStays = ({ title, properties }: PopularStaysProps) => {
  if (properties.length === 0) return <div />;

  return (
    <section
      aria-label={title}
      className="w-full max-w-400 mx-auto px-6 py-2 md:px-10 lg:px-12"
    >
      <PopularStaysSlider title={title} properties={properties} />
    </section>
  );
};
