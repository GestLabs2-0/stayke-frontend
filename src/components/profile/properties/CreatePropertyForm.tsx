"use client";

import { useFormik } from "formik";
import { useCallback, useEffect, useRef, useState } from "react";
import { sileo } from "sileo";

import { ChipSelector } from "@/components/profile/properties/ChipSelector";
import { FormInput } from "@/components/profile/properties/FormInput";
import { FormTextarea } from "@/components/profile/properties/FormTextarea";
import { ImageUpload } from "@/components/profile/properties/ImageUpload";
import { LocationMap } from "@/components/profile/properties/LocationMap";
import { PropertyPreview } from "@/components/profile/properties/PropertyPreview";
import { SectionCard } from "@/components/profile/properties/SectionCard";
import { parseDraft, serializeDraft } from "@/helpers/draft";
import type { CreatePropertyFormValues } from "@/types/property/createProperty";
import {
  CREATE_PROPERTY_INITIAL_VALUES,
  MAX_IMAGES,
  PREDEFINED_AMENITIES,
  PREDEFINED_RULES,
} from "@/types/property/createProperty";
import { formValidationSchema } from "@/types/property/validation";

// ── Constants ──

const DRAFT_KEY = "stayke_property_draft";
const AUTO_SAVE_INTERVAL = 30_000;

// ── Main Component ──

export function CreatePropertyForm() {
  const [showDraftBanner, setShowDraftBanner] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);

  const latestRef = useRef(CREATE_PROPERTY_INITIAL_VALUES);

  const {
    values,
    errors,
    touched,
    isSubmitting,
    setFieldValue,
    setValues,
    setFieldTouched,
    handleSubmit,
  } = useFormik({
    initialValues: CREATE_PROPERTY_INITIAL_VALUES,
    validationSchema: formValidationSchema,
    validateOnBlur: true,
    validateOnChange: true,
    onSubmit: async (_values, _helpers) => {
      // API call — currently mocked
      console.log("Property values:", _values);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      sileo.success({ title: "Propiedad creada con éxito!" });
      localStorage.removeItem(DRAFT_KEY);
      _helpers.resetForm();
    },
  });

  latestRef.current = values;

  // ── Draft: restore on mount ──

  useEffect(() => {
    const raw = localStorage.getItem(DRAFT_KEY);
    if (!raw) return;
    const draft = parseDraft(raw);
    if (draft?.name) {
      setShowDraftBanner(true);
    }
  }, []);

  const handleRestoreDraft = useCallback(() => {
    const raw = localStorage.getItem(DRAFT_KEY);
    if (!raw) return;
    const draft = parseDraft(raw);
    if (draft) {
      setValues(draft);
      setShowDraftBanner(false);
      sileo.success({ title: "Borrador restaurado" });
    }
  }, [setValues]);

  const handleDismissDraft = useCallback(() => {
    localStorage.removeItem(DRAFT_KEY);
    setShowDraftBanner(false);
  }, []);

  // ── Draft: auto-save ──

  useEffect(() => {
    const interval = setInterval(() => {
      const cur = latestRef.current;
      if (!cur.name && !cur.description && !cur.address) return;
      localStorage.setItem(DRAFT_KEY, serializeDraft(cur));
      sileo.info({ title: "Borrador guardado" });
    }, AUTO_SAVE_INTERVAL);
    return () => clearInterval(interval);
  }, []);

  const handleSaveDraft = useCallback(() => {
    localStorage.setItem(DRAFT_KEY, serializeDraft(latestRef.current));
    sileo.success({ title: "Borrador guardado" });
  }, []);

  // ── Generic field setter (handles number coercion) ──

  const setField = useCallback(
    (field: keyof CreatePropertyFormValues) =>
      (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const value =
          e.target.type === "number" ? Number(e.target.value) : e.target.value;
        setFieldValue(field, value);
      },
    [setFieldValue],
  );

  // ── Get Formik error for a field (only if touched or after submit) ──

  const fieldError = useCallback(
    (field: keyof CreatePropertyFormValues): string | undefined => {
      if (!touched[field]) return;
      const err = errors[field];
      return typeof err === "string" ? err : undefined;
    },
    [touched, errors],
  );

  // ── Location handler ──

  const setLocation = useCallback(
    (lat: number, lng: number) => {
      setFieldValue("latitude", lat);
      setFieldValue("longitude", lng);
      setFieldTouched("latitude", true);
      setFieldTouched("longitude", true);
    },
    [setFieldValue, setFieldTouched],
  );

  // ── Render ──

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div className="mx-auto w-full max-w-3xl space-y-6 pb-28 md:pb-6">
          {/* Draft restore banner */}
          {showDraftBanner && (
            <div className="flex items-center justify-between rounded-2xl border border-[#c3c6d6] bg-amber-50 px-5 py-4">
              <p className="font-plus-jakarta text-[14px] font-medium text-[#171717]">
                Tienes un borrador guardado. ¿Quieres restaurarlo?
              </p>
              <div className="flex shrink-0 items-center gap-3">
                <button
                  type="button"
                  onClick={handleRestoreDraft}
                  className="rounded-full bg-[#3b007f] px-4 py-1.5 font-plus-jakarta text-[13px] font-semibold text-white transition-colors hover:bg-[#5307ad]"
                >
                  Restaurar
                </button>
                <button
                  type="button"
                  onClick={handleDismissDraft}
                  className="font-plus-jakarta text-[13px] font-semibold text-[#a0a5b5] transition-colors hover:text-[#434654]"
                >
                  Descartar
                </button>
              </div>
            </div>
          )}

          {/* ── Información básica ── */}
          <SectionCard title="Información básica">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FormInput
                label="Nombre de la propiedad"
                placeholder="Ej: Casa boutique con piscina"
                value={values.name}
                onChange={setField("name")}
                error={fieldError("name")}
              />
              <FormInput
                label="Dirección"
                placeholder="Calle 123 #45-67, Medellín"
                value={values.address}
                onChange={setField("address")}
                error={fieldError("address")}
              />
            </div>
            <FormTextarea
              label="Descripción"
              placeholder="Cuéntales a los huéspedes qué hace especial este lugar..."
              value={values.description}
              onChange={setField("description")}
              rows={4}
              error={fieldError("description")}
            />
          </SectionCard>

          {/* ── Ubicación ── */}
          <div className="card-white">
            <div className="mb-4 border-b border-[#c3c6d6] pb-3">
              <h3 className="font-montserrat text-[15px] font-bold text-[#171717]">
                Ubicación
              </h3>
            </div>
            <div className="space-y-4">
              <LocationMap
                latitude={values.latitude}
                longitude={values.longitude}
                onChange={setLocation}
              />
              {fieldError("latitude") && (
                <p className="font-plus-jakarta text-[14px] font-medium text-red-300">
                  {fieldError("latitude")}
                </p>
              )}
              <FormTextarea
                label="Guía para llegar"
                placeholder="Indicaciones adicionales para encontrar la propiedad..."
                value={values.addressGuide}
                onChange={setField("addressGuide")}
                rows={3}
              />
            </div>
          </div>

          {/* ── Fotos ── */}
          <SectionCard title="Fotos">
            <ImageUpload
              images={values.images}
              onChange={(files) => setFieldValue("images", files)}
              maxImages={MAX_IMAGES}
            />
          </SectionCard>

          {/* ── Comodidades ── */}
          <SectionCard title="Comodidades">
            <ChipSelector
              label="Selecciona las comodidades de la propiedad"
              options={PREDEFINED_AMENITIES}
              selected={values.amenities}
              onChange={(amenities) => setFieldValue("amenities", amenities)}
              allowCustom
            />
          </SectionCard>

          {/* ── Reglas ── */}
          <SectionCard title="Reglas">
            <ChipSelector
              label="Reglas de la casa"
              options={PREDEFINED_RULES}
              selected={values.rules}
              onChange={(rules) => setFieldValue("rules", rules)}
              allowCustom
            />
          </SectionCard>

          {/* ── Detalles de reserva ── */}
          <SectionCard title="Detalles de reserva">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FormInput
                label="Check-in"
                type="time"
                value={values.checkIn}
                onChange={setField("checkIn")}
              />
              <FormInput
                label="Check-out"
                type="time"
                value={values.checkOut}
                onChange={setField("checkOut")}
              />
              <FormInput
                label="Huéspedes máx."
                type="number"
                min={1}
                step={1}
                value={values.maxGuests}
                onChange={setField("maxGuests")}
                error={fieldError("maxGuests")}
              />
              <FormInput
                label="Precio por noche"
                type="number"
                min={0}
                step={1000}
                value={values.pricePerNight}
                onChange={setField("pricePerNight")}
                prefix="$"
                error={fieldError("pricePerNight")}
              />
            </div>
          </SectionCard>
        </div>

        {/* ── Actions bar (mobile: sticky bottom / desktop: inline) ── */}
        <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-[#c3c6d6] bg-white px-4 py-3 md:relative md:mt-6 md:border-none md:bg-transparent md:px-0 md:py-0">
          <div className="mx-auto flex max-w-3xl items-center gap-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 rounded-full bg-[#3b007f] px-8 py-3 font-plus-jakarta font-semibold text-white transition-colors hover:bg-[#5307ad] disabled:opacity-50 md:flex-none"
            >
              {isSubmitting ? "Guardando..." : "Guardar"}
            </button>
            <button
              type="button"
              onClick={handleSaveDraft}
              className="flex-1 rounded-full border border-[#c3c6d6] bg-white px-6 py-3 font-plus-jakarta font-semibold text-[#434654] transition-colors hover:bg-[#ebe7e7] md:flex-none"
            >
              Guardar borrador
            </button>
            <button
              type="button"
              onClick={() => setPreviewOpen(true)}
              className="flex-1 rounded-full border border-[#3b007f] px-6 py-3 font-plus-jakarta font-semibold text-[#3b007f] transition-colors hover:bg-[#3b007f]/5 md:flex-none"
            >
              Vista previa
            </button>
          </div>
        </div>
      </form>

      {/* ── Preview modal ── */}
      <PropertyPreview
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        values={values}
      />
    </>
  );
}
