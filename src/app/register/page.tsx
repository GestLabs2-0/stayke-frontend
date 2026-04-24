"use client";

//Library
import { ChevronRight, ChevronLeft, Check, Loader2 } from "lucide-react";
//Next
import Link from "next/link";

//React
import { useState } from "react";

//Own Components
import { STEPS } from "@/src/constants";
import { STEP_COMPONENTS } from "@/src/components/register/StepRender";
import { StepIndicator } from "@/src/components/register/StepIndicator";

//Type
import type { RegisterFormData } from "@/src/types/RegisterFormData";

export const Register = () => {
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);

  const totalSteps = STEPS.length;

  //Start Data Registration
  const [form, setForm] = useState<RegisterFormData>({
    dni: "",
    wallet: "",
    firstName: "",
    lastName: "",
    country: "",
    documentType: "",
    documentNumber: "",
    email: "",
    phone: "",
    address: "",
    image: "",
    isHost: false,
  });

  const onChange = <K extends keyof RegisterFormData>(
    field: K,
    value: RegisterFormData[K]
  ) => {
    console.log("FIELD:", field);
    console.log("VALUE:", value);
    console.log("TYPE:", typeof value);

    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleNext = () => {
    if (step < totalSteps) setStep((s) => s + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep((s) => s - 1);
  };

  // 🔥 Simulación de submit (loading real)
  const handleSubmit = async () => {
    try {
      setSubmitting(true);

      // Simulación de request
      await new Promise((res) => setTimeout(res, 2000));

      console.log("Mock submit done");
    } catch (error) {
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  const renderStep = () => {
    const StepComponent = STEP_COMPONENTS[step];
    if (!StepComponent) return null;

    return (
      <StepComponent form={form as RegisterFormData} onChange={onChange} />
    );
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="mb-8 text-center">
          <Link href="/">
            <span className="font-display text-2xl font-bold text-foreground">
              Stay<span className="text-gradient">ke</span>
            </span>
          </Link>
          <p className="mt-2 text-sm text-muted-foreground">
            Create your account
          </p>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
          <StepIndicator current={step} />

          <div className="mb-6">
            <h2 className="font-display text-xl font-bold text-foreground">
              {STEPS[step - 1].label}
            </h2>
            <p className="text-sm text-muted-foreground">
              Step {step} of {totalSteps}
            </p>
          </div>

          {/* Step content */}
          <div className="min-h-60">{renderStep()}</div>

          {/* Navigation */}
          <div className="mt-8 flex items-center justify-between gap-3">
            {/* Back */}
            <button
              onClick={handleBack}
              disabled={step === 1 || submitting}
              className="inline-flex items-center gap-2 rounded-xl border border-border px-4 py-2.5 text-sm font-medium text-muted-foreground disabled:opacity-30 cursor-pointer"
            >
              <ChevronLeft className="h-4 w-4" />
              Back
            </button>

            {step < totalSteps ? (
              <button
                onClick={handleNext}
                disabled={submitting}
                className="inline-flex items-center gap-2 gradient-solana rounded-xl px-5 py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-40 cursor-pointer"
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="inline-flex items-center gap-2 gradient-solana rounded-xl px-5 py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-60"
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Check className="h-4 w-4" />
                    Create Account
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
