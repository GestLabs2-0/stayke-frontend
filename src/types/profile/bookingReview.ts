import * as Yup from "yup";

import type { Booking } from "@/types/api/booking";

// ── BookingReviewForm (compartido huésped/anfitrión) ──

export interface BookingReviewFormValues {
  score: number;
  comment: string;
}

/** Resultado del envío on-chain de la reseña. */
export type OnChainReviewResult =
  | { ok: true }
  | { ok: false; already: boolean };

export interface BookingReviewFormProps {
  open: boolean;
  booking: Booking;
  /** true = el huésped reseña al anfitrión; false = el anfitrión reseña al huésped. */
  isHostReview: boolean;
  /**
   * Verifica el campo on-chain objetivo (hostReview o guestReview === 0) y, si
   * corresponde, envía la transacción de reseña on-chain.
   */
  onChainReview: (score: number) => Promise<OnChainReviewResult>;
  onClose: () => void;
  /** Se llama tras una reseña creada con éxito para refrescar la lista. */
  onSubmitted: () => void;
}

export const BOOKING_REVIEW_INITIAL_VALUES: BookingReviewFormValues = {
  score: 0,
  comment: "",
};

/** Validación de la reseña (Formik + Yup). */
export const bookingReviewValidationSchema = Yup.object({
  score: Yup.number()
    .min(1, "Seleccioná una puntuación")
    .max(5, "La puntuación es de 1 a 5")
    .required("Seleccioná una puntuación"),
  comment: Yup.string().max(1000, "Máximo 1000 caracteres"),
});

/** PDA de perfil del usuario reseñado según la dirección de la reseña. */
export function reviewedProfilePda(
  booking: Booking,
  isHostReview: boolean,
): string {
  return isHostReview
    ? booking.hostValues.userProfile
    : booking.guestValues.userProfile;
}
