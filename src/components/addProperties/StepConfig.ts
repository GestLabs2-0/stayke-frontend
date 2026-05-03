import { AddPropertyFormData } from "@/src/types/AddPropertyFormData";
import { FileText, ImageIcon, MapPin, Home } from "lucide-react";

// ── Steps config ──────────────────────────────────────────────────────────────
export const PROPERTY_STEPS = [
  { id: 1, label: "Basics", icon: FileText },
  { id: 2, label: "Location", icon: MapPin },
  { id: 3, label: "Details", icon: Home },
  { id: 4, label: "Photos", icon: ImageIcon },
] as const;

export const PROPERTY_TYPES = [
  "Apartment",
  "House",
  "Studio",
  "Villa",
  "Cabin",
  "Loft",
  "Other",
];

export const STEP_DETAILS_CONFIG: {
  key: keyof AddPropertyFormData;
  label: string;
}[] = [
  { key: "maxGuests", label: "Max guests" },
  { key: "bedrooms", label: "Bedrooms" },
  { key: "bathrooms", label: "Bathrooms" },
];
