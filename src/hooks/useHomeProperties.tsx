import { useEffect, useState } from "react";

import { propertiesData } from "@/components/home/EscapadasCerca/mocks";
import { popularStaysData } from "@/components/home/PopularStays/mocks";
import { propertyToCard } from "@/helpers/propertyToCard";
import { staykeApi } from "@/lib/staykeApi";
import type { PropertyCard } from "@/types/property-cards";

const HOME_PROPERTIES_LIMIT = 10;
const ESCAPADAS_PROPERTIES = 3;

/**
 * Carga las propiedades reales del home desde GET /properties.
 * Ante un fallo de la API degrada a los mocks; si la API responde sin
 * resultados, las secciones quedan vacías (y se colapsan).
 */
export function useHomeProperties() {
  const [escapadas, setEscapadas] = useState<PropertyCard[]>([]);
  const [popular, setPopular] = useState<PropertyCard[]>([]);

  useEffect(() => {
    let cancelled = false;

    staykeApi
      .getProperties({ limit: HOME_PROPERTIES_LIMIT, isActive: true })
      .then((result) => {
        if (cancelled) return;

        const list = result.data;

        if (!result.status || !Array.isArray(list)) {
          setEscapadas(propertiesData);
          setPopular(popularStaysData);
          return;
        }

        const cards = list.map((property) => propertyToCard(property));

        setEscapadas(cards.slice(0, ESCAPADAS_PROPERTIES));
        setPopular(cards.slice(ESCAPADAS_PROPERTIES));
      })
      .catch(() => {
        if (cancelled) return;
        setEscapadas(propertiesData);
        setPopular(popularStaysData);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return { escapadas, popular };
}
