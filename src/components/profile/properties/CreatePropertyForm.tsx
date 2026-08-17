"use client";

import { useFormik } from "formik";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { sileo } from "sileo";

import { findListingPda } from "@GestLabs2-0/stayke-core";
import { ChipSelector } from "@/components/profile/properties/ChipSelector";
import { FormInput } from "@/components/profile/properties/FormInput";
import { FormTextarea } from "@/components/profile/properties/FormTextarea";
import { ImageUpload } from "@/components/profile/properties/ImageUpload";
import { LocationMap } from "@/components/profile/properties/LocationMap";
import { PropertyPreview } from "@/components/profile/properties/PropertyPreview";
import { SectionCard } from "@/components/profile/properties/SectionCard";
import { parseDraft, serializeDraft } from "@/helpers/draft";
import { hexToUint8Array } from "@/helpers/hexToUint8Array";
import useNetwork from "@/hooks/useNetwork";
import { useSignAndSendTx } from "@/hooks/useSignAndSendTx";
import { useWalletContext } from "@/hooks/useWallet";
import { buildInitPropertyTx } from "@/lib/contracts/buildInitPropertyTx";
import { staykeApi } from "@/lib/staykeApi";
import type { CreatePropertyFormValues } from "@/types/property/createProperty";
import {
  CREATE_PROPERTY_INITIAL_VALUES,
  MAX_IMAGES,
  PREDEFINED_AMENITIES,
  PREDEFINED_RULES,
  PROPERTY_TYPE_OPTIONS,
  toCreatePropertyRequest,
} from "@/types/property/createProperty";
import { formValidationSchema } from "@/types/property/validation";

// ── Constants ──

const DRAFT_KEY = "stayke_property_draft";
const AUTO_SAVE_INTERVAL = 30_000;

// ── Main Component ──

export function CreatePropertyForm() {
  const [showDraftBanner, setShowDraftBanner] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);

  const { userProfile, userWallet, refetchAccounts } = useWalletContext();
  const { client } = useNetwork();
  const { handleSignAndSend, loading: loadingSignAndSend } =
    useSignAndSendTx(userWallet);

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
    onSubmit: async (formValues, helpers) => {
      if (!userProfile) {
        sileo.error({ title: "Tu perfil on-chain no está disponible aún" });
        return;
      }
      if (!userWallet) {
        sileo.error({ title: "No se pudo obtener tu billetera" });
        return;
      }

      try {
        const listingId = userProfile.data.listings;
        const [listingPda] = await findListingPda({
          userProfile: userProfile.address,
          listingId,
        });

        // 1. Create the property off-chain (backend), using the listing PDA.
        const payload = toCreatePropertyRequest(formValues, listingPda);
        const result = await staykeApi.createProperty(
          payload,
          formValues.images[0],
        );

        if (!result.status || !result.data) {
          const msg = Array.isArray(result.message)
            ? result.message.join(", ")
            : result.message;
          sileo.error({ title: msg || "Error al crear la propiedad" });
          return;
        }

        // 2. Initialize the property on-chain (stayke-core initializeListing).
        const stateHash = hexToUint8Array(result.data.hashedValue);
        const contentRef = new Uint8Array(32); // TODO: Arweave/IPFS content ref
        const { tx } = await buildInitPropertyTx({
          wallet: userWallet,
          userProfile: userProfile.address,
          listingId,
          price: formValues.price,
          stateHash,
          contentRef,
          client,
        });

        const { status } = await handleSignAndSend(tx);
        if (!status) {
          sileo.error({
            title: "No se pudo crear la propiedad en blockchain",
          });
          return;
        }

        await refetchAccounts();
        sileo.success({ title: "Propiedad creada con éxito" });
        localStorage.removeItem(DRAFT_KEY);
        helpers.resetForm();
      } catch {
        sileo.error({ title: "Error al conectar con el servidor" });
      }
    },
  });

  latestRef.current = values;

  // ── Draft: restore on mount ──

  useEffect(() => {
    const raw = localStorage.getItem(DRAFT_KEY);
    if (!raw) return;
    const draft = parseDraft(raw);
    if (draft?.title) {
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
      if (!cur.title && !cur.description && !cur.address) return;
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

  // ── Memoized property type options to avoid inline object creation ──

  const propertyTypeOptions = useMemo(
    () =>
      PROPERTY_TYPE_OPTIONS.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      )),
    [],
  );

  const submitLabel = useMemo(() => {
    if (!userProfile) return "Cargando perfil...";
    if (loadingSignAndSend) return "Creando en blockchain...";
    if (isSubmitting) return "Guardando...";
    return "Guardar";
  }, [userProfile, loadingSignAndSend, isSubmitting]);

  const disableSubmit = isSubmitting || loadingSignAndSend || !userProfile;

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
                label="Título de la propiedad"
                placeholder="Ej: Casa boutique con piscina"
                value={values.title}
                onChange={setField("title")}
                error={fieldError("title")}
              />
              <div className="flex flex-col gap-1">
                <label
                  htmlFor="propertyType"
                  className="font-plus-jakarta text-[14px] font-medium text-[#434654]"
                >
                  Tipo de propiedad
                </label>
                <select
                  id="propertyType"
                  value={values.propertyType}
                  onChange={(e) =>
                    setFieldValue("propertyType", e.target.value)
                  }
                  className="rounded-xl border border-[#c3c6d6] bg-white px-4 py-3 font-plus-jakarta text-[15px] text-[#171717] outline-none transition-colors focus:border-[#3b007f]"
                >
                  {propertyTypeOptions}
                </select>
                {fieldError("propertyType") && (
                  <p className="font-plus-jakarta text-[13px] font-medium text-red-400">
                    {fieldError("propertyType")}
                  </p>
                )}
              </div>
            </div>
            <FormTextarea
              label="Descripción"
              placeholder="Cuéntales a los huéspedes qué hace especial este lugar..."
              value={values.description}
              onChange={setField("description")}
              rows={4}
            />
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <FormInput
                label="País (código ISO)"
                placeholder="Ej: CO"
                value={values.countryCode}
                onChange={setField("countryCode")}
                error={fieldError("countryCode")}
                maxLength={2}
              />
              <FormInput
                label="Ciudad"
                placeholder="Ej: Medellín"
                value={values.city}
                onChange={setField("city")}
                error={fieldError("city")}
              />
              <FormInput
                label="Departamento / Estado"
                placeholder="Ej: Antioquia"
                value={values.state}
                onChange={setField("state")}
                error={fieldError("state")}
              />
            </div>
            <FormInput
              label="Dirección"
              placeholder="Calle 123 #45-67"
              value={values.address}
              onChange={setField("address")}
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
                value={values.addressHint}
                onChange={setField("addressHint")}
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
            {fieldError("images") && (
              <p className="font-plus-jakarta text-[14px] font-medium text-red-400">
                {fieldError("images")}
              </p>
            )}
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
          <SectionCard title="Reglas de la casa">
            <ChipSelector
              label="Reglas"
              options={PREDEFINED_RULES}
              selected={values.houseRules}
              onChange={(rules) => setFieldValue("houseRules", rules)}
              allowCustom
            />
          </SectionCard>

          {/* ── Detalles de reserva ── */}
          <SectionCard title="Detalles de reserva">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FormInput
                label="Check-in"
                type="time"
                value={values.checkinTime}
                onChange={setField("checkinTime")}
              />
              <FormInput
                label="Check-out"
                type="time"
                value={values.checkoutTime}
                onChange={setField("checkoutTime")}
              />
              <FormInput
                label="Huéspedes máx."
                type="number"
                min={1}
                step={1}
                value={values.maxGuest}
                onChange={setField("maxGuest")}
                error={fieldError("maxGuest")}
              />
              <FormInput
                label="Precio por noche"
                type="number"
                min={0}
                step={1000}
                value={values.price}
                onChange={setField("price")}
                prefix="$"
                error={fieldError("price")}
              />
              <FormInput
                label="Habitaciones"
                type="number"
                min={0}
                step={1}
                value={values.bedrooms}
                onChange={setField("bedrooms")}
                error={fieldError("bedrooms")}
              />
              <FormInput
                label="Baños"
                type="number"
                min={0}
                step={1}
                value={values.bathrooms}
                onChange={setField("bathrooms")}
                error={fieldError("bathrooms")}
              />
              <FormInput
                label="Mínimo de noches"
                type="number"
                min={1}
                step={1}
                value={values.minNights}
                onChange={setField("minNights")}
                error={fieldError("minNights")}
              />
              <FormInput
                label="Máximo de noches"
                type="number"
                min={1}
                step={1}
                value={values.maxNights}
                onChange={setField("maxNights")}
                error={fieldError("maxNights")}
              />
            </div>
          </SectionCard>
        </div>

        {/* ── Actions bar (mobile: sticky bottom / desktop: inline) ── */}
        <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-[#c3c6d6] bg-white px-4 py-3 md:relative md:mt-6 md:border-none md:bg-transparent md:px-0 md:py-0">
          <div className="mx-auto flex max-w-3xl items-center gap-3">
            <button
              type="submit"
              disabled={disableSubmit}
              className="flex-1 rounded-full bg-[#3b007f] px-8 py-3 font-plus-jakarta font-semibold text-white transition-colors hover:bg-[#5307ad] disabled:opacity-50 md:flex-none"
            >
              {submitLabel}
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
