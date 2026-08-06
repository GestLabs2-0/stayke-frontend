import type { DestinyNearbyPlace } from "./DestinyNearbyPlace";

export type MapMarker = {
  lat: number;
  lng: number;
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
};

export type DestinyMapProps = {
  center?: [number, number];
  zoom?: number;
  markers?: MapMarker[];
  places?: DestinyPlace[];
  onPlaceSelect: (place: DestinyPlace) => void;
};
