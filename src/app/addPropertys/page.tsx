"use client";

import { PROPERTY_STEPS } from "@/src/components/addPropertys/StepConfig";
import { StepIndicator } from "@/src/components/addPropertys/Steps/StepIndicator";
import {
  renderStep,
  STEP_LABELS,
} from "@/src/components/addPropertys/Steps/StepRender";
import { AddPropertyFormData } from "@/src/types/AddPropertyFormData";
// Library
import { ChevronLeft, ChevronRight, Check, Loader2, Home } from "lucide-react";

// Next
import Link from "next/link";

// React
import { useState } from "react";

// ── Main page ─────────────────────────────────────────────────────────────────
const AddProperty = () => {
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const totalSteps = PROPERTY_STEPS.length;

  const [form, setForm] = useState<AddPropertyFormData>({
    title: "",
    description: "",
    propertyType: "",
    country: "",
    city: "",
    address: "",
    pricePerNight: "",
    maxGuests: "",
    bedrooms: "",
    bathrooms: "",
    image: "",
  });

  const onChange = <K extends keyof AddPropertyFormData>(
    field: K,
    value: AddPropertyFormData[K]
  ) => setForm((prev) => ({ ...prev, [field]: value }));

  const handleNext = () => {
    if (step < totalSteps) setStep((s) => s + 1);
  };
  const handleBack = () => {
    if (step > 1) setStep((s) => s - 1);
  };

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      // TODO: integrate on-chain createListing instruction
      await new Promise((res) => setTimeout(res, 2000));
      setSubmitted(true);
    } catch (err) {
      console.error("Failed to create property:", err);
    } finally {
      setSubmitting(false);
    }
  };

  // ── Success screen ─────────────────────────────────────────────────────────
  if (submitted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-md text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full border-2 border-primary bg-primary/10">
            <Check className="h-10 w-10 text-primary" />
          </div>
          <h1 className="font-display text-3xl font-bold text-foreground mb-2">
            Property <span className="text-gradient">Listed!</span>
          </h1>
          <p className="text-sm text-muted-foreground mb-8">
            Your property has been submitted to the Stayke network. It will
            appear on{" "}
            <span className="text-foreground font-medium">Explore Stays</span>{" "}
            once confirmed on-chain.
          </p>
          <div className="flex flex-col gap-3">
            <Link
              href="/listPropertys"
              className="inline-flex items-center justify-center gap-2 gradient-solana rounded-xl px-5 py-3 text-sm font-semibold text-primary-foreground hover:scale-105 transition-all"
            >
              <Home className="h-4 w-4" />
              View all properties
            </Link>
            <button
              onClick={() => {
                setSubmitted(false);
                setStep(1);
                setForm({
                  title: "",
                  description: "",
                  propertyType: "",
                  country: "",
                  city: "",
                  address: "",
                  pricePerNight: "",
                  maxGuests: "",
                  bedrooms: "",
                  bathrooms: "",
                  image: "",
                });
              }}
              className="text-sm text-muted-foreground transition-colors cursor-pointer hover:text-primary w-fit mx-auto"
            >
              Add another property
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-lg">
        {/* ── Header ── */}
        <div className="mb-8 text-center">
          <Link href="/">
            <span className="font-display text-2xl font-bold text-foreground">
              Stay<span className="text-gradient">ke</span>
            </span>
          </Link>
          <p className="mt-2 text-sm text-muted-foreground">
            List your property on Solana
          </p>
        </div>

        {/* ── Card ── */}
        <div className="relative rounded-2xl border border-border bg-card p-6 shadow-card overflow-hidden">
          {/* Ambient glow */}
          <div className="pointer-events-none absolute -top-16 -right-16 h-56 w-56 rounded-full bg-primary/6 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-16 -left-16 h-56 w-56 rounded-full bg-secondary/6 blur-3xl" />

          <div className="relative">
            <StepIndicator current={step} />

            {/* Step title */}
            <div className="mb-6">
              <h2 className="font-display text-xl font-bold text-foreground">
                {STEP_LABELS[step].title}
              </h2>
              <p className="text-sm text-muted-foreground">
                {STEP_LABELS[step].subtitle} · Step {step} of {totalSteps}
              </p>
            </div>

            {/* Step content */}
            <div className="min-h-64">
              {renderStep({ step, form, onChange })}
            </div>

            {/* Navigation */}
            <div className="mt-8 flex items-center justify-between gap-3">
              <button
                onClick={handleBack}
                disabled={step === 1 || submitting}
                className="inline-flex items-center gap-2 rounded-xl border border-border px-4 py-2.5 text-sm font-medium text-muted-foreground disabled:opacity-30 cursor-pointer hover:border-border-strong transition-colors"
              >
                <ChevronLeft className="h-4 w-4" />
                Back
              </button>

              {step < totalSteps ? (
                <button
                  onClick={handleNext}
                  disabled={submitting}
                  className="inline-flex items-center gap-2 gradient-solana rounded-xl px-5 py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-40 cursor-pointer shadow-glow"
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="inline-flex items-center gap-2 gradient-solana rounded-xl px-5 py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-60 cursor-pointer shadow-glow"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Publishing…
                    </>
                  ) : (
                    <>
                      <Check className="h-4 w-4" />
                      Publish Property
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Footer hint */}
        <p className="mt-6 text-center text-xs text-muted-foreground">
          Your listing will be stored on{" "}
          <span className="text-foreground font-medium">Solana</span> via the
          Stayke smart contract.
        </p>
      </div>
    </div>
  );
};

export default AddProperty;
