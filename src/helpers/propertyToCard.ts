import type { PropertyResponse } from "@/types/api/property";
import type { PropertyCard } from "@/types/property-cards";

/**
 * Imágenes de respaldo mientras el backend no expone una URL pública para la
 * propiedad (GET /properties solo devuelve imageKey).
 */
// const PLACEHOLDER_IMAGES = [
//   "/images/properties/casa-boutique.jpg",
//   "/images/properties/apartamento-1.jpg",
//   "/images/properties/apartamento-2.jpg",
//   "/image-slider-one.webp",
//   "/image-slider-two.webp",
//   "/image-slider-three.webp",
//   "/image-slider-four.webp",
// ];

/**
 * Convierte una PropertyResponse del backend en una PropertyCard para las
 * secciones del home. El backend no entrega rating ni imagen, por lo que la
 * calificación se omite y la imagen se resuelve con un placeholder estable.
 */
export function propertyToCard(property: PropertyResponse): PropertyCard {
  const location = [property.city, property.state].filter(Boolean).join(", ");

  return {
    id: property.pda,
    title: property.title,
    location,
    imageUrl: property.imageUrl,
    price: Number(property.price) || 0,
    priceLabel: "por noche",
    href: "#",
  };
}
