import type { Dispatch } from "react";

import { staykeApi } from "@/lib/staykeApi";
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

  const limit = 50;

  staykeApi
    .getProperties({ limit, offset: 0 })
    .then((result) => {
      if (!result.status || !result.data) {
        action({ type: "set_loading", loading: false });
        action({
          type: "set_properties",
          payload: { properties: [], pages: 0, totalCount: 0 },
        });
        return;
      }

      // Map backend response to HostProperty
      const data = result.data as unknown as {
        data: HostProperty[];
        meta: { totalPages: number; total: number };
      };
      const properties = data.data ?? [];
      const _meta = data.meta;

      // Client-side filtering for unsupported backend params
      const filtered = properties.filter((item) => {
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
        if (filters.priceUpTo > 0 && filters.priceUpTo < item.price)
          return false;
        if (filters.status === "active" && !item.isActive) return false;
        if (filters.status === "inactive" && item.isActive) return false;
        return true;
      });

      const totalCount = filtered.length;
      const pages = Math.max(1, Math.ceil(totalCount / limit));

      action({ type: "set_loading", loading: false });
      action({
        type: "set_properties",
        payload: { properties: filtered, pages, totalCount },
      });
    })
    .catch(() => {
      action({ type: "set_loading", loading: false });
      action({
        type: "set_properties",
        payload: { properties: [], pages: 0, totalCount: 0 },
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
          pages: Math.max(1, Math.ceil(updated.length / 50)),
          totalCount: updated.length,
        },
      });
    })
    .catch(() => {
      action({ type: "set_loading", loading: false });
    });
}
