import { useEffect, useState } from "react";

import { propertyToCard } from "@/helpers/propertyToCard";
import { staykeApi } from "@/lib/staykeApi";
import type { UseHomePropertiesReturn } from "@/types/home";
import type { PropertyCard } from "@/types/property-cards";

const HOME_PROPERTIES_LIMIT = 10;
const ESCAPADAS_PROPERTIES = 3;

/**
 * Carga las propiedades reales del home desde GET /properties.
 * Ante un fallo de la API degrada a los mocks; si la API responde sin
 * resultados, las secciones quedan vacías.
 */
export function useHomeProperties(): UseHomePropertiesReturn {
  const [escapadas, setEscapadas] = useState<PropertyCard[]>([]);
  const [popular, setPopular] = useState<PropertyCard[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    staykeApi
      .getProperties({ limit: HOME_PROPERTIES_LIMIT, isActive: true })
      .then((result) => {
        if (cancelled) return;

        const list = result.data;

        if (!result.status || !Array.isArray(list)) {
          setLoading(false);
          return;
        }

        const cards = list.map((property) => propertyToCard(property));

        setEscapadas(cards.slice(0, ESCAPADAS_PROPERTIES));
        setPopular(cards.slice(ESCAPADAS_PROPERTIES));
        setLoading(false);
      })
      .catch(() => {
        if (cancelled) return;
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return { escapadas, popular, loading, isLoading: loading };
}
