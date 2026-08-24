import type { PropertyResponse } from "@/types/api/property";
import type { DestinyPlace, MapBounds } from "@/types/destinys";

/**
 * Converts a backend PropertyResponse into a DestinyPlace structure
 * for the interactive map and cards.
 */
export function propertyToDestinyPlace(
  property: PropertyResponse,
): DestinyPlace {
  const addressParts = [property.address, property.city, property.state].filter(
    Boolean,
  );

  return {
    id: property.pda || property.id,
    name: property.title,
    rating: 4.9,
    price: Number(property.price) || 0,
    location: addressParts.join(", ") || "Ubicación disponible",
    city: property.city || "",
    country: property.countryCode || "Venezuela",
    image: property.imageUrl || "/image-slider-one.webp",
    lat: Number(property.latitude),
    lng: Number(property.longitude),
    bedrooms: Number(property.bedrooms) || 1,
    guests: Number(property.maxGuest) || 1,
    pda: property.pda,
    propertyType: property.propertyType,
    bathrooms: Number(property.bathrooms) || 1,
    nearby: [],
  };
}

/**
 * Checks if geographic coordinates (latitude, longitude) are inside
 * a Leaflet MapBounds bounding box.
 */
export function isPropertyInBounds(
  latitude: number,
  longitude: number,
  bounds: MapBounds,
): boolean {
  if (Number.isNaN(latitude) || Number.isNaN(longitude)) return false;

  const { north, south, west, east } = bounds;
  const inLat = latitude >= south && latitude <= north;
  const inLng =
    west <= east
      ? longitude >= west && longitude <= east
      : longitude >= west || longitude <= east;

  return inLat && inLng;
}
