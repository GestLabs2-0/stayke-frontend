import type { DestinyPlace } from "./DestinyMap";

export type DestinyPlaceCardProps = {
  place: DestinyPlace;
  onClose?: () => void;
  isSelected?: boolean;
  onSelect?: (place: DestinyPlace) => void;
  index?: number;
};
