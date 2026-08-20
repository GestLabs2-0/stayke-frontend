import type { PropertyResponse } from "./property";

// ── Property detail page (GET /properties/:idPda) ──

export interface PropertyHost {
  owner: string;
  name: string;
  lastName: string;
  email?: string;
  isVerified: boolean;
  country: string;
  phone: string;
  listings: number;
  // Address del anfitrión onchain (0–5). Fuente on-chain/reputación.
  reputation?: number;
  // Fecha ISO desde la que el anfitrión hospeda.
  hostedSince?: string;
}

// Placeholder: FE-08 will define the real review shape.
export interface PropertyReview {
  id: string;
  author: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface PropertyDetail extends PropertyResponse {
  host: PropertyHost;
  // Placeholder: backend will provide the real amenities later.
  amenities: string[];
  // Placeholder: FE-08 will wire the real reviews source.
  reviews: PropertyReview[];
}
