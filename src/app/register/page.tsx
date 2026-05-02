"use client";

import { ChevronRight, ChevronLeft, Check, Loader2 } from "lucide-react";
import Link from "next/link";
import { Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

import { STEPS } from "@/src/constants";
import { STEP_COMPONENTS } from "@/src/components/register/StepRender";
import { StepIndicator } from "@/src/components/register/StepIndicator";

import type { RegisterFormData } from "@/src/types/RegisterFormData";
import { useSignStaykeTx } from "@/src/components/hooks/useSignStaykeTx";
import { useRegisterUser } from "@/src/components/hooks/contract/registerUser";
import { parseDoctype } from "@/src/constants/DocumentTypes";
import staykeAPI from "@/src/lib/staykeAPI";
import { usePrivy } from "@privy-io/react-auth";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/src/constant";
import { address } from "@solana/kit";
import {
  findUserProfilePda,
  findReputationProfilePda,
  findIdentityPda,
} from "@/src/generated/stayke_core";
import { useUserContext } from "@/src/components/contexts/UserContext";
import { link } from "fs";

const RegisterInner = () => {
  const searchParams = useSearchParams();
  const isOffchain = searchParams.get("offchain") === "true";

  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const { user, linkEmail } = usePrivy();
  const signStayke = useSignStaykeTx();
  const { registerUser } = useRegisterUser();
  const { refetch } = useUserContext();
  const router = useRouter();
  const totalSteps = STEPS.length;

  const [form, setForm] = useState<RegisterFormData>({
    firstName: "",
    lastName: "",
    country: "",
    documentType: "",
    documentNumber: "",
    email: "",
    phone: "",
    address: "",
    image: "",
  });

  const onChange = <K extends keyof RegisterFormData>(
    field: K,
    value: RegisterFormData[K]
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (step < totalSteps) setStep((s) => s + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep((s) => s - 1);
  };

  // ── Full registration: on-chain + off-chain ───────────────────────────────
  const handleFullSubmit = async () => {
    if (!user || user.wallet == undefined) {
      toast.info("Please log in with Privy to continue.");
      return;
    }
    setSubmitting(true);

    try {
      const encoder = new TextEncoder();
      const countryBytes = encoder.encode(form.country);

      const documentation = `${form.country}:${form.documentType}:${form.documentNumber}`;
      const documentationBytes = encoder.encode(documentation);

      const dniHash = await window.crypto.subtle.digest(
        "SHA-256",
        documentationBytes
      );

      const { identity, reputationProfile, userProfile } = await registerUser({
        props: signStayke,
        id: new Uint8Array(dniHash),
        doctype: parseDoctype(form.documentType),
        countryCode: countryBytes,
      });

      if (!identity || !reputationProfile || !userProfile) {
        toast.error("On-chain registration failed. Please try again.");
        return;
      }

      toast.success("On-chain registration successful!");

      const { data, status } = await staykeAPI.registerUser({
        country: form.country,
        documentType: form.documentType,
        dni: documentation,
        identityAddr: identity,
        profileAddr: userProfile,
        reputationAddr: reputationProfile,
        email: form.email,
        firstName: form.firstName,
        image: form.image,
        lastName: form.lastName,
        phone: form.phone,
        privyId: user.id,
        wallet: user.wallet.address,
      });

      if (status) {
        toast.success("Registration successful!");
        localStorage.setItem("stayke_user", JSON.stringify(data));
        refetch();
      }

      router.push(ROUTES.HOME);
    } catch (error) {
      console.error(error);
      toast.error("Registration failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // ── Off-chain only: derive PDAs from wallet, skip Solana tx ──────────────
  const handleOffchainSubmit = async () => {
    if (!user || !user.wallet) {
      toast.info("Please log in with Privy to continue.");
      return;
    }

    setSubmitting(true);

    try {
      const walletAddr = address(user.wallet.address);

      // Derive the on-chain PDAs deterministically from the wallet + document
      const [userProfilePda] = await findUserProfilePda({
        authority: walletAddr,
      });
      const [reputationPda] = await findReputationProfilePda({
        authority: walletAddr,
      });

      // Identity PDA needs the document hash (same formula used during on-chain registration)
      const documentation = `${form.country}:${form.documentType}:${form.documentNumber}`;
      const encoder = new TextEncoder();
      const dniHash = await window.crypto.subtle.digest(
        "SHA-256",
        encoder.encode(documentation)
      );
      const [identityPda] = await findIdentityPda({
        id: new Uint8Array(dniHash),
      });

      const { data, status, message } = await staykeAPI.registerUser({
        country: form.country,
        documentType: form.documentType,
        dni: documentation,
        identityAddr: identityPda,
        profileAddr: userProfilePda,
        reputationAddr: reputationPda,
        email: form.email,
        firstName: form.firstName,
        image: form.image,
        lastName: form.lastName,
        phone: form.phone,
        privyId: user.id,
        wallet: user.wallet.address,
      });

      if (status) {
        toast.success("Registration complete!");
        localStorage.setItem("stayke_user", JSON.stringify(data));
        // Update UserContext so AuthGate unlocks immediately
        refetch();
        router.push(ROUTES.HOME);
      } else {
        toast.error(message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Registration failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmit = () => {
    if (isOffchain) {
      handleOffchainSubmit();
    } else {
      handleFullSubmit();
    }
  };

  const renderStep = () => {
    const StepComponent = STEP_COMPONENTS[step];
    if (!StepComponent) return null;
    return (
      <StepComponent form={form as RegisterFormData} onChange={onChange} />
    );
  };

  useEffect(() => {
    if (!user) {
      router.push(ROUTES.HOME);
      return;
    }

    if (user.email) {
      let email = user.email.address;
      setForm((prev) => ({ ...prev, email }));
      return;
    }

    linkEmail();
  }, [user]);

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
            {isOffchain ? "Complete your profile" : "Create your account"}
          </p>
        </div>

        {isOffchain && (
          <div className="mb-4 rounded-xl border border-primary/30 bg-primary/10 px-4 py-3 flex items-start gap-3">
            <span className="mt-0.5 h-5 w-5 shrink-0 rounded-full gradient-solana flex items-center justify-center text-[10px] font-bold text-primary-foreground">
              ✓
            </span>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Your on-chain account is ready. Just fill in your profile info to
              finish registration.
            </p>
          </div>
        )}

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
                className="inline-flex cursor-pointer items-center gap-2 gradient-solana rounded-xl px-5 py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-60"
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    {isOffchain ? "Completing..." : "Creating..."}
                  </>
                ) : (
                  <>
                    <Check className="h-4 w-4" />
                    {isOffchain ? "Complete Registration" : "Create Account"}
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

const Register = () => (
  <Suspense
    fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    }
  >
    <RegisterInner />
  </Suspense>
);

export default Register;
