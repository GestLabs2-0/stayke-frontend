import { IconArtic } from "@/components/Icons/IconArtic";
import { IconBeach } from "@/components/Icons/IconBeach";
import { IconCamp } from "@/components/Icons/IconCamp";
import { IconDiamond } from "@/components/Icons/IconDiamond";
import { IconHouse } from "@/components/Icons/IconHouse";
import { IconSwimming } from "@/components/Icons/IconSwimming";
import type { FilterItem } from "@/types/FilterBar";

export const filters: FilterItem[] = [
  { key: "playas", icon: IconBeach, label: "Playas" },
  { key: "cabañas", icon: IconHouse, label: "Cabañas" },
  { key: "lujo", icon: IconDiamond, label: "Lujo" },
  { key: "piscinas", icon: IconSwimming, label: "Piscinas" },
  { key: "ártico", icon: IconArtic, label: "Ártico" },
  { key: "campo", icon: IconCamp, label: "Campo" },
];
