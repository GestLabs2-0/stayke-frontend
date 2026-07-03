import {
  DiamondIcon,
  LandmarkIcon,
  MusicNoteIcon,
  PlaneIcon,
  WaveIcon,
} from "@/icons";
import type { Destination } from "@/types/header";

export const destinosData: Destination[] = [
  { ciudad: "Caracas", descripcion: "Una joya escondida", icon: DiamondIcon },
  {
    ciudad: "Madrid, España",
    descripcion: "Por lugares emblemáticos como este: Parque del Retiro",
    icon: LandmarkIcon,
  },
  {
    ciudad: "Cúcuta, Colombia",
    descripcion: "Para un viaje al extranjero",
    icon: PlaneIcon,
  },
  {
    ciudad: "Lecherías",
    descripcion: "Por su encanto costero",
    icon: WaveIcon,
  },
  {
    ciudad: "Barquisimeto, Lara",
    descripcion: "Una joya escondida",
    icon: MusicNoteIcon,
  },
];
