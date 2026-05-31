import { UserType } from "./user";

export interface IProperties {
  property_key: string;
  description: string;
  title: string;
  host: UserType;
  images: string[];
  country: string;
  state: string;
  city: string;
  address: string;
  latitude: number;
  longitude: number;
  maxGuests: number;
  bedrooms: number;
  bathrooms: number;
  pricePerNight: number;
  minNights: number;
  maxNights: number;
  checkinTime: string;
  checkoutTime: string;
  houseRules: string;
  amenities: string[];
  isActive: boolean;
  property_type: PropertyTypeE;
  properties: IProperties[];
}

export enum PropertyTypeE {
  Apartment = "Apartment",
  House = "House",
  Cabin = "Cabin",
  Villa = "Villa",
  Cottage = "Cottage",
  Bungalow = "Bungalow",
  Loft = "Loft",
  Studio = "Studio",
  Treehouse = "Treehouse",
  Yurt = "Yurt",
}
