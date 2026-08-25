"use client";

import { useHomeProperties } from "@/hooks/useHomeProperties";
import { EscapadasCerca, EscapadasCercaSkeleton } from "./EscapadasCerca";
import { NoPropertiesAnnouncement } from "./NoPropertiesAnnouncement";
import { PopularStays, PopularStaysSkeleton } from "./PopularStays";

export const HomeProperties = () => {
  const { escapadas, popular, loading } = useHomeProperties();

  if (loading) {
    return (
      <>
        <EscapadasCercaSkeleton />
        <PopularStaysSkeleton />
      </>
    );
  }

  const hasProperties = escapadas.length > 0 || popular.length > 0;

  if (!hasProperties) {
    return <NoPropertiesAnnouncement />;
  }

  return (
    <>
      <EscapadasCerca properties={escapadas} />
      <PopularStays title="Alojamientos populares" properties={popular} />
    </>
  );
};
