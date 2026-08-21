import type { ApiPaginatedResponse } from "../http";

/** Cuerpo de POST /reviews. `reviewerPda` lo inyecta el servidor desde el JWT. */
export interface CreateReviewRequest {
  /** PDA on-chain del usuario reseñado (para la reseña de huésped: el anfitrión). */
  userPda: string;
  /** PDA on-chain de la reserva que originó la reseña. */
  bookingPda: string;
  /** PDA on-chain de la propiedad reseñada. */
  propertyPda: string;
  /** true cuando la reseña es sobre un anfitrión (caso huésped). */
  isHostReview: boolean;
  /** Puntaje del 1 al 5. */
  score: number;
  /** Comentario opcional. */
  comment: string;
}

/** Reseña devuelta por POST /reviews. */
export interface Review {
  id?: number;
  userPda: string;
  bookingPda: string;
  propertyPda: string;
  reviewerPda: string;
  isHostReview: boolean;
  score: number;
  comment: string;
}

/** Query params de GET /api/v1.0/reviews. */
export interface GetReviewsParams {
  /** Wallet del usuario reseñado (ej: el anfitrión). */
  userPda?: string;
  /** Reserva que originó la reseña. */
  bookingPda?: string;
  /** Propiedad reseñada. */
  propertyPda?: string;
  /** Wallet del reseñador (para comprobar si ya reseñamos esta reserva). */
  reviewerPda?: string;
  score?: number;
  limit?: number;
  offset?: number;
}

/** Respuesta paginada de GET /api/v1.0/reviews. */
export interface ReviewListResult extends ApiPaginatedResponse<Review> {}
