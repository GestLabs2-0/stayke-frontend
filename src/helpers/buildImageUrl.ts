import { PROPERTY_IMAGE_BASE_URL } from "@/shared/constants";

/**
 * Resuelve la URL pública de una imagen de propiedad a partir de su `imageKey`,
 * concatenándolo a la base de imágenes (NEXT_PUBLIC_PROPERTY_IMAGE_URL).
 * Devuelve `undefined` cuando no hay imageKey.
 */
export function buildImageUrl(imageKey?: string | null): string | undefined {
  if (!imageKey) return undefined;
  if (imageKey.startsWith("http://") || imageKey.startsWith("https://")) {
    return imageKey;
  }
  const normalized = imageKey.startsWith("/") ? imageKey.slice(1) : imageKey;
  return `${PROPERTY_IMAGE_BASE_URL.replace(/\/$/, "")}/${normalized}`;
}
