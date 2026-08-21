import * as Yup from "yup";

import type { Booking } from "@/types/api/booking";

// ── GuestReviewForm ──

export interface GuestReviewFormValues {
  score: number;
  comment: string;
}

export interface GuestReviewFormProps {
  open: boolean;
  booking: Booking;
  onClose: () => void;
  /** Se llama tras una reseña creada con éxito para refrescar la lista. */
  onSubmitted: () => void;
}

export const GUEST_REVIEW_INITIAL_VALUES: GuestReviewFormValues = {
  score: 0,
  comment: "",
};

/** Validación de la reseña de huésped (Formik + Yup). */
export const guestReviewValidationSchema = Yup.object({
  score: Yup.number()
    .min(1, "Seleccioná una puntuación")
    .max(5, "La puntuación es de 1 a 5")
    .required("Seleccioná una puntuación"),
  comment: Yup.string().max(1000, "Máximo 1000 caracteres"),
});
