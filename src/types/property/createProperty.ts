import type { CreatePropertyRequest, PropertyType } from "@/types/api/property";

// ── Predefined options ──

export const PREDEFINED_AMENITIES = [
  "WiFi",
  "Estacionamiento",
  "Aire acondicionado",
  "Calefacción",
  "Cocina",
  "Lavadora",
  "Secadora",
  "TV",
  "Balcón",
  "Jardín",
  "Piscina",
  "Mascotas permitidas",
  "Acceso discapacitados",
] as const;

export const PREDEFINED_RULES = [
  "No fumar",
  "No fiestas",
  "Mascotas permitidas",
  "Horario de silencio",
  "No zapatos en interiores",
] as const;

export const PROPERTY_TYPE_OPTIONS: { value: PropertyType; label: string }[] = [
  { value: "casa", label: "Casa" },
  { value: "apto", label: "Apartamento" },
  { value: "cabaña", label: "Cabaña" },
  { value: "otro", label: "Otro" },
];

// ── Form values (what the form collects) ──

export interface CreatePropertyFormValues {
  title: string;
  description: string;
  propertyType: PropertyType;
  countryCode: string;
  city: string;
  state: string;
  address: string;
  addressHint: string;
  latitude: number | null;
  longitude: number | null;
  images: File[];
  amenities: string[];
  houseRules: string[];
  maxGuest: number;
  bedrooms: number;
  bathrooms: number;
  price: number;
  minNights: number;
  maxNights: number;
  checkinTime: string;
  checkoutTime: string;
}

// ── Default values for Formik ──

export const CREATE_PROPERTY_INITIAL_VALUES: CreatePropertyFormValues = {
  title: "",
  description: "",
  propertyType: "casa",
  countryCode: "",
  city: "",
  state: "",
  address: "",
  addressHint: "",
  latitude: null,
  longitude: null,
  images: [],
  amenities: [],
  houseRules: [],
  maxGuest: 1,
  bedrooms: 0,
  bathrooms: 0,
  price: 0,
  minNights: 1,
  maxNights: 7,
  checkinTime: "15:00",
  checkoutTime: "11:00",
};

// ── Converts form values to API payload ──

export function toCreatePropertyRequest(
  values: CreatePropertyFormValues,
  pda: string,
): CreatePropertyRequest {
  return {
    pda,
    title: values.title,
    description: values.description,
    propertyType: values.propertyType,
    countryCode: values.countryCode,
    city: values.city,
    state: values.state,
    address: values.address,
    addressHint: values.addressHint,
    latitude: values.latitude ?? 0,
    longitude: values.longitude ?? 0,
    maxGuest: values.maxGuest,
    bedrooms: values.bedrooms,
    bathrooms: values.bathrooms,
    price: values.price,
    minNights: values.minNights,
    maxNights: values.maxNights,
    checkinTime: values.checkinTime,
    checkoutTime: values.checkoutTime,
    // Backend stores houseRules as a single string; serialize amenities + rules
    houseRules: JSON.stringify([...values.amenities, ...values.houseRules]),
  };
}

// ── Image config ──

// Backend (propertyImageSchema) accepts a SINGLE jpeg/png file ≤5MB, so the
// frontend is limited to one image for now. To re-enable multi-image support
// later: restore MAX_IMAGES to 8, un-comment the multi-file block in ImageUpload,
// and re-add `multiple` to the file input there.
export const MAX_IMAGES = 1; // was 8 — multi-image support paused
export const MAX_IMAGE_SIZE_MB = 5; // was 10 — backend rejects files > 5MB
export const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  // "image/webp", // backend only accepts jpeg/png — re-enable when supported
];
