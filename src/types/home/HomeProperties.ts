import type { PropertyCard } from "../property-cards";

export interface UseHomePropertiesReturn {
  escapadas: PropertyCard[];
  popular: PropertyCard[];
  loading: boolean;
  isLoading: boolean;
}

export interface NoPropertiesAnnouncementProps {
  className?: string;
}
