export type PropertyType = "casa" | "apto" | "cabaña" | "otro";

// ── Backend-aligned response ──

export interface PropertyResponse {
  id: string;
  pda: string;
  hostId: string;
  title: string;
  description: string;
  propertyType: PropertyType;
  countryCode: string;
  city: string;
  state: string;
  address: string;
  addressHint: string;
  latitude: number;
  longitude: number;
  maxGuest: number;
  bedrooms: number;
  bathrooms: number;
  price: number;
  minNights: number;
  maxNights: number;
  checkinTime: string;
  checkoutTime: string;
  houseRules: string;
  hashedValue: string;
  isActive?: boolean;
  blockChainExists?: boolean;
}

// ── Request payloads ──

export interface CreatePropertyRequest {
  pda: string;
  title: string;
  description: string;
  propertyType: PropertyType;
  countryCode: string;
  city: string;
  state: string;
  address: string;
  addressHint: string;
  latitude: number;
  longitude: number;
  maxGuest: number;
  bedrooms: number;
  bathrooms: number;
  price: number;
  minNights: number;
  maxNights: number;
  checkinTime: string;
  checkoutTime: string;
  houseRules: string;
}

export interface EditPropertyRequest {
  title?: string;
  description?: string;
  propertyType?: PropertyType;
  countryCode?: string;
  city?: string;
  state?: string;
  address?: string;
  addressHint?: string;
  latitude?: number;
  longitude?: number;
  maxGuest?: number;
  bedrooms?: number;
  bathrooms?: number;
  price?: number;
  minNights?: number;
  maxNights?: number;
  checkinTime?: string;
  checkoutTime?: string;
  houseRules?: string;
  isActive?: boolean;
}

// ── List query params (GET /properties) ──

export interface GetPropertiesParams {
  hostId?: string;
  isActive?: boolean;
  location?: string;
  checkIn?: string;
  checkOut?: string;
  guests?: number;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  limit?: number;
}

// ── Paginated response ──

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface PropertyListResult {
  status: boolean;
  data: PropertyResponse[] | null;
  meta: PaginationMeta | null;
  message: string | string[];
  errors?: string[];
}

// ── Property type display labels ──

export const PROPERTY_TYPE_LABELS: Record<PropertyType, string> = {
  casa: "Casa",
  apto: "Apartamento",
  cabaña: "Cabaña",
  otro: "Otro",
};
