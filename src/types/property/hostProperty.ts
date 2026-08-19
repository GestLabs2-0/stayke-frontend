import type { PropertyType } from "@/types/api/property";

export interface HostProperty {
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
  isActive: boolean;
  blockChainExists?: boolean;
  // UI-only fields (not in backend response)
  imageUrl?: string;
  reviews?: number;
  bookingsCompleted?: number;
}
