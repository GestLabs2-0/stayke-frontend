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
