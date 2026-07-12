import type { PropertyCard } from "./PropertyCard";

export type PropertyCardProps = {
  property: PropertyCard;
  className?: string;
  /** Si true, la imagen ocupa el espacio vertical disponible para igualar altura */
  expandImage?: boolean;
};
