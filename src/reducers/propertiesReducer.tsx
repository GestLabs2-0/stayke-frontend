import type { Dispatch } from "react";

import { staykeApi } from "@/lib/staykeApi";
import type {
  PropertiesReducerActions,
  PropertiesStateI,
} from "@/types/property/HostProperties";
import type { HostProperty } from "@/types/property/hostProperty";
import type { PropertyFilters } from "@/types/property/propertyFilters";

/** Tamaño de página para la paginación en cliente. */
export const PROPERTIES_PAGE_SIZE = 10;
/** Máximo que el backend devuelve por request (límite de la API). */
const PROPERTIES_FETCH_LIMIT = 100;

export const INITIAL_STATE_PROPERTIES: PropertiesStateI = {
  filters: {
    address: "",
    name: "",
    priceUpTo: 0,
    reviewsFrom: 0,
    status: "all",
  },
  pageIndex: 1,
  pages: 1,
  properties: [],
  totalCount: 0,
  loading: false,
};

export function propertiesReducer(
  state: PropertiesStateI,
  action: PropertiesReducerActions,
) {
  switch (action.type) {
    case "increment_page_index": {
      const nextIndex = state.pageIndex + 1;
      return {
        ...state,
        pageIndex: Math.min(nextIndex, state.pages),
      };
    }
    case "reduce_page_index": {
      const previousIndex = state.pageIndex - 1;
      return { ...state, pageIndex: previousIndex < 1 ? 1 : previousIndex };
    }
    case "reset_filter": {
      return {
        ...state,
        filters: INITIAL_STATE_PROPERTIES.filters,
      };
    }
    case "set_loading": {
      return {
        ...state,
        loading: action.loading,
      };
    }
    case "set_properties": {
      const { pages, properties, totalCount } = action.payload;
      return {
        ...state,
        pages,
        properties,
        totalCount,
        pageIndex: 1,
      };
    }
    case "update_filter": {
      return { ...state, filters: { ...state.filters, ...action.payload } };
    }
    default:
      return { ...state };
  }
}

/**
 * Filtros que el backend no soporta (nombre, dirección y reseñas) se aplican
 * en cliente sobre el set completo de propiedades del host.
 */
function applyClientFilters(
  properties: HostProperty[],
  filters: PropertyFilters,
): HostProperty[] {
  return properties.filter((item) => {
    if (
      filters.name &&
      !item.title.toLowerCase().includes(filters.name.toLowerCase())
    )
      return false;
    if (
      filters.address &&
      !item.address.toLowerCase().includes(filters.address.toLowerCase())
    )
      return false;
    if (filters.reviewsFrom > (item.reviews ?? 0)) return false;
    return true;
  });
}

export function fetchProperties(
  filters: PropertyFilters,
  hostId: string | null | undefined,
  action: Dispatch<PropertiesReducerActions>,
) {
  action({ type: "set_loading", loading: true });

  const maxPrice = filters.priceUpTo > 0 ? filters.priceUpTo : undefined;

  // El backend devuelve TODAS las propiedades cuando isActive se omite.
  // Solo se filtra por estado cuando se piden explícitamente activas o inactivas.
  const isActive =
    filters.status === "all" ? undefined : filters.status === "active";

  staykeApi
    .getProperties({
      hostId: hostId ?? undefined,
      isActive,
      maxPrice,
      limit: PROPERTIES_FETCH_LIMIT,
    })
    .then((result) => {
      const properties = (
        result.status && Array.isArray(result.data) ? result.data : []
      ) as HostProperty[];

      const filtered = applyClientFilters(properties, filters);

      const totalCount = filtered.length;
      const pages = Math.max(1, Math.ceil(totalCount / PROPERTIES_PAGE_SIZE));

      action({ type: "set_loading", loading: false });
      action({
        type: "set_properties",
        payload: { properties: filtered, totalCount, pages },
      });
    })
    .catch(() => {
      action({ type: "set_loading", loading: false });
      action({
        type: "set_properties",
        payload: { properties: [], totalCount: 0, pages: 0 },
      });
    });
}

export function updatePropertieStatus(
  properties: HostProperty[],
  id: string,
  action: Dispatch<PropertiesReducerActions>,
) {
  action({ type: "set_loading", loading: true });

  const property = properties.find((p) => p.id === id);
  if (!property) {
    action({ type: "set_loading", loading: false });
    return;
  }

  const newActive = !property.isActive;

  staykeApi
    .updateProperty(id, { isActive: newActive })
    .then((result) => {
      if (!result.status) {
        action({ type: "set_loading", loading: false });
        return;
      }

      const updated = properties.map((p) =>
        p.id === id ? { ...p, isActive: newActive } : p,
      );

      action({ type: "set_loading", loading: false });
      action({
        type: "set_properties",
        payload: {
          properties: updated,
          pages: Math.max(1, Math.ceil(updated.length / PROPERTIES_PAGE_SIZE)),
          totalCount: updated.length,
        },
      });
    })
    .catch(() => {
      action({ type: "set_loading", loading: false });
    });
}
