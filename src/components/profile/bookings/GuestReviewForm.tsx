"use client";

import { address } from "@solana/kit";
import { useFormik } from "formik";
import { useEffect, useRef } from "react";
import { sileo } from "sileo";

import { fetchMaybeUserProfile } from "@GestLabs2-0/stayke-core";
import useNetwork from "@/hooks/useNetwork";
import { StarIcon } from "@/icons/StarIcon";
import { XIcon } from "@/icons/XIcon";
import { staykeApi } from "@/lib/staykeApi";
import type {
  GuestReviewFormProps,
  GuestReviewFormValues,
} from "@/types/profile/guestReview";
import {
  GUEST_REVIEW_INITIAL_VALUES,
  guestReviewValidationSchema,
} from "@/types/profile/guestReview";

const STAR_LABELS = ["1", "2", "3", "4", "5"];

/**
 * Modal para que el huésped reseñe una reserva completada. Crea la reseña en el
 * backend (POST /reviews) resolviendo previamente la wallet del anfitrión.
 */
export function GuestReviewForm({
  open,
  booking,
  onClose,
  onSubmitted,
}: GuestReviewFormProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const { client } = useNetwork();

  useEffect(() => {
    if (!open) return;
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [open, onClose]);

  const { values, errors, touched, isSubmitting, setFieldValue, handleSubmit } =
    useFormik<GuestReviewFormValues>({
      initialValues: GUEST_REVIEW_INITIAL_VALUES,
      validationSchema: guestReviewValidationSchema,
      validateOnChange: true,
      onSubmit: async (formValues) => {
        try {
          let userPda = booking.hostValues.userProfile;
          try {
            const account = await fetchMaybeUserProfile(
              client.rpc,
              address(booking.hostValues.userProfile),
            );
            userPda = account.exists
              ? account.data.authority
              : booking.hostValues.userProfile;
          } catch {
            // fallback: se usa el perfil embebido si no se puede resolver la wallet
          }

          const result = await staykeApi.createReview({
            userPda,
            bookingPda: booking.idPda,
            propertyPda: booking.propertyValues.pda,
            isHostReview: true,
            score: formValues.score,
            comment: formValues.comment.trim(),
          });

          if (result.status) {
            sileo.success({ title: "Reseña publicada" });
            onSubmitted();
            onClose();
          } else {
            sileo.error({
              title: "No se pudo publicar la reseña",
              description: "Contactá al soporte si el problema continúa.",
            });
          }
        } catch (error) {
          console.error("Error creating review:", error);
          sileo.error({ title: "Error al crear la reseña" });
        }
      },
    });

  if (!open) return null;

  const scoreError = touched.score && errors.score;
  const commentError = touched.comment && errors.comment;

  return (
    // biome-ignore lint/a11y/noStaticElementInteractions: is allowed
    // biome-ignore lint/a11y/useKeyWithClickEvents: this is ok
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === overlayRef.current) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="guest-review-dialog-title"
        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl animate-in fade-in zoom-in-95 duration-200"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3
              id="guest-review-dialog-title"
              className="font-montserrat text-lg font-bold text-[#171717]"
            >
              Reseñar tu estadía
            </h3>
            <p className="mt-1 font-sans text-[13px] text-[#434654]">
              {booking.propertyValues.title}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#ebe7e7] text-[#434654] transition-colors hover:bg-[#c3c6d6]"
          >
            <XIcon />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-5">
          <div>
            <span
              id="guest-review-score-label"
              className="font-plus-jakarta text-[13px] font-semibold text-[#434654]"
            >
              Puntuación
            </span>
            <div className="mt-2 flex items-center gap-1">
              {STAR_LABELS.map((value, index) => {
                const starValue = index + 1;
                const filled = starValue <= values.score;
                return (
                  <button
                    key={value}
                    type="button"
                    aria-label={`${starValue} estrella${starValue === 1 ? "" : "s"}`}
                    aria-pressed={filled}
                    onClick={() => setFieldValue("score", starValue)}
                    className={`cursor-pointer rounded-md p-1 transition-colors hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 ${
                      filled ? "text-accent-warm" : "text-[#d3d6de]"
                    }`}
                  >
                    <StarIcon className="size-7" filled={filled} />
                  </button>
                );
              })}
            </div>
            {scoreError && (
              <p className="mt-1 font-sans text-xs font-medium text-red-600">
                {scoreError}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="guest-review-comment"
              className="font-plus-jakarta text-[13px] font-semibold text-[#434654]"
            >
              Comentario
            </label>
            <textarea
              id="guest-review-comment"
              value={values.comment}
              onChange={(e) => setFieldValue("comment", e.target.value, true)}
              rows={4}
              maxLength={1000}
              placeholder="Contá cómo fue tu estadía…"
              className="mt-1.5 w-full resize-none rounded-[10px] bg-[#EFF3F6] px-4 py-3 font-plus-jakarta text-[14px] font-semibold text-[#171717] focus-visible:outline-none focus-visible:shadow-[0_0_0_2px_rgba(59,0,127,0.4)]"
            />
            {commentError && (
              <p className="mt-1 font-sans text-xs font-medium text-red-600">
                {commentError}
              </p>
            )}
          </div>

          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="rounded-full border border-[#c3c6d6] bg-white px-5 py-2.5 font-plus-jakarta text-[13px] font-semibold text-[#434654] transition-colors hover:bg-[#ebe7e7] disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-full bg-primary px-5 py-2.5 font-plus-jakarta text-[13px] font-semibold text-white transition-colors hover:bg-primary-hover disabled:opacity-60"
            >
              {isSubmitting ? "Publicando…" : "Publicar reseña"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
