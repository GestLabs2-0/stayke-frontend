"use client";

import dynamic from "next/dynamic";
import type { PropertyCard as PropertyCardType } from "@/types/property-cards";

const PopularStaysSlider = dynamic(
  () => import("./PopularStaysSlider").then((mod) => mod.PopularStaysSlider),
  { ssr: false },
);

type PopularStaysProps = {
  title: string;
  properties: PropertyCardType[];
};

export const PopularStays = ({ title, properties }: PopularStaysProps) => {
  if (properties.length === 0) return null;

  return (
    <section className="w-full max-w-400 mx-auto px-6 py-2 md:px-10 lg:px-12">
      <PopularStaysSlider title={title} properties={properties} />
    </section>
  );
};
