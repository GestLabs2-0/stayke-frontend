"use client";

import { useHomeProperties } from "@/hooks/useHomeProperties";
import { EscapadasCerca } from "./EscapadasCerca";
import { PopularStays } from "./PopularStays";

export const HomeProperties = () => {
  const { escapadas, popular } = useHomeProperties();

  return (
    <>
      <EscapadasCerca properties={escapadas} />
      <PopularStays title="Alojamientos populares" properties={popular} />
    </>
  );
};
