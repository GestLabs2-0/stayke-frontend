// ── Types ─────────────────────────────────────────────────────────────────────
export interface AddPropertyFormData {
  // Step 1 – Basics
  title: string;
  description: string;
  propertyType: string;
  // Step 2 – Location
  country: string;
  city: string;
  address: string;
  // Step 3 – Details & Pricing
  pricePerNight: string;
  maxGuests: string;
  bedrooms: string;
  bathrooms: string;
  // Step 4 – Media
  image: string;
}
