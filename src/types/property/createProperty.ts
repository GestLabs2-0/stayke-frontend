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

// ── Form values (what the form collects) ──

export interface CreatePropertyFormValues {
  name: string;
  description: string;
  address: string;
  addressGuide: string;
  latitude: number | null;
  longitude: number | null;
  images: File[];
  amenities: string[];
  rules: string[];
  checkIn: string; // HH:mm
  checkOut: string; // HH:mm
  maxGuests: number;
  pricePerNight: number;
}

// ── API payload (what gets sent to the backend) ──

export interface CreatePropertyPayload {
  name: string;
  description: string;
  address: string;
  addressGuide: string;
  latitude: number;
  longitude: number;
  amenities: string[];
  rules: string[];
  checkIn: string;
  checkOut: string;
  maxGuests: number;
  pricePerNight: number;
}

// ── Default values for Formik ──

export const CREATE_PROPERTY_INITIAL_VALUES: CreatePropertyFormValues = {
  name: "",
  description: "",
  address: "",
  addressGuide: "",
  latitude: null,
  longitude: null,
  images: [],
  amenities: [],
  rules: [],
  checkIn: "15:00",
  checkOut: "11:00",
  maxGuests: 1,
  pricePerNight: 0,
};

// ── Image config ──

export const MAX_IMAGES = 8;
export const MAX_IMAGE_SIZE_MB = 10;
export const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
