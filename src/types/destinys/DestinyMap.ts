import type { DestinyNearbyPlace } from "./DestinyNearbyPlace";

export type MapMarker = {
  lat: number;
  lng: number;
};

export type MapBounds = {
  north: number;
  south: number;
  west: number;
  east: number;
};

export type DestinyPlace = {
  id: string;
  name: string;
  rating: number;
  price: number;
  location: string;
  city: string;
  country: string;
  image: string;
  lat: number;
  lng: number;
  bedrooms: number;
  guests: number;
  nearby: DestinyNearbyPlace[];
  pda?: string;
  propertyType?: string;
  bathrooms?: number;
};

export type DestinyMapProps = {
  center?: [number, number];
  zoom?: number;
  markers?: MapMarker[];
  places?: DestinyPlace[];
  selectedPlaceId?: string | null;
  onPlaceSelect: (place: DestinyPlace) => void;
  onBoundsChange?: (bounds: MapBounds) => void;
};
