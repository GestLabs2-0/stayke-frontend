import { IconArtic } from "@/icons/IconArtic";
import { IconBeach } from "@/icons/IconBeach";
import { IconCamp } from "@/icons/IconCamp";
import { IconDiamond } from "@/icons/IconDiamond";
import { IconHouse } from "@/icons/IconHouse";
import { IconSwimming } from "@/icons/IconSwimming";
import type { FilterItem } from "@/types/FilterBar";

export const filters: FilterItem[] = [
  { key: "playas", icon: IconBeach, label: "Playas" },
  { key: "cabañas", icon: IconHouse, label: "Cabañas" },
  { key: "lujo", icon: IconDiamond, label: "Lujo" },
  { key: "piscinas", icon: IconSwimming, label: "Piscinas" },
  { key: "ártico", icon: IconArtic, label: "Ártico" },
  { key: "campo", icon: IconCamp, label: "Campo" },
];
