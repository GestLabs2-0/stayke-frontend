// FilterBar types and interfaces

export type FilterKey =
  | "playas"
  | "cabañas"
  | "lujo"
  | "piscinas"
  | "ártico"
  | "campo";

export interface FilterItem {
  key: FilterKey;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string;
}
