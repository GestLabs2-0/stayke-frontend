import type { DestinyPlace } from "./DestinyMap";

export type DestinyPlaceCardProps = {
  place: DestinyPlace;
  onClose?: () => void;
};
