export type PropertyStatusFilter = "all" | "active" | "inactive";

export interface PropertyFilters {
  name: string;
  address: string;
  reviewsFrom: number; // minimum reviews; 0 = no filter
  priceUpTo: number; // maximum price per night; 0 = no filter
  status: PropertyStatusFilter;
}

export const PROPERTY_FILTERS_DEFAULTS: PropertyFilters = {
  name: "",
  address: "",
  reviewsFrom: 0,
  priceUpTo: 0,
  status: "all",
};
