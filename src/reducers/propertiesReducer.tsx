import type { Dispatch } from "react";

import { hostPropertiesMock } from "@/components/profile/properties/listProperties/mockHostProperties";
import type {
  PropertiesReducerActions,
  PropertiesStateI,
} from "@/types/property/HostProperties";
import type { HostProperty } from "@/types/property/hostProperty";
import type { PropertyFilters } from "@/types/property/propertyFilters";

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

export function fetchProperties(
  filters: PropertyFilters,
  action: Dispatch<PropertiesReducerActions>,
) {
  action({ type: "set_loading", loading: true });

  const filteredProperties = hostPropertiesMock.filter((item) => {
    if (
      filters.name &&
      !item.name.toLowerCase().includes(filters.name.toLowerCase())
    )
      return false;
    if (
      filters.address &&
      !item.address.toLowerCase().includes(filters.address.toLowerCase())
    )
      return false;
    if (filters.reviewsFrom > item.reviews) return false;
    if (filters.priceUpTo > item.pricePerNight) return false;
    if (filters.status === "active" && !item.active) return false;
    if (filters.status === "inactive" && item.active) return false;

    return true;
  });

  // Latencia simulada para el mock. Reemplazar por la llamada real al API.
  return simulateLatency().then(() => {
    const totalCount = filteredProperties.length;
    const pages = Math.ceil(totalCount / 10);
    action({ type: "set_loading", loading: false });

    action({
      type: "set_properties",
      payload: {
        properties: filteredProperties,
        pages,
        totalCount,
      },
    });
  });
}

export function updatePropertieStatus(
  properties: HostProperty[],
  id: string,
  action: Dispatch<PropertiesReducerActions>,
) {
  action({ type: "set_loading", loading: true });

  const updatedProperties = properties.map((p) =>
    p.id === id ? { ...p, active: !p.active } : p,
  );

  // Latencia simulada para el mock. Reemplazar por la llamada real al API.
  return simulateLatency().then(() => {
    const totalCount = updatedProperties.length;
    const pages = Math.ceil(totalCount / 10);
    action({ type: "set_loading", loading: false });

    action({
      type: "set_properties",
      payload: {
        properties: updatedProperties,
        pages,
        totalCount,
      },
    });
  });
}

function simulateLatency(ms = 600) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
