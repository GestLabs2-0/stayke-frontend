export interface LocationMapProps {
  latitude: number | null;
  longitude: number | null;
  onChange: (lat: number, lng: number) => void;
}

export interface NominatimResult {
  display_name: string;
  lat: string;
  lon: string;
}
