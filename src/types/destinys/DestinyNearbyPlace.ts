export type DestinyNearbyType = "restaurant" | "market" | "cinema";

export type DestinyNearbyPlace = {
  id: string;
  type: DestinyNearbyType;
  name: string;
  description: string;
};
