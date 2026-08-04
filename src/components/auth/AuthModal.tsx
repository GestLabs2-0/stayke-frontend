"use client";

import { useEffect, useRef, useState } from "react";

import { XIcon } from "@/icons/XIcon";
import type { AuthModalShellProps, AuthView } from "@/types/auth";
import { AuthViewMain } from "./AuthViewMain";
import { EmailLoginForm } from "./EmailLoginForm";
import { OTPVerificationForm } from "./OTPVerificationForm";

function AuthModalShell({ isOpen, onClose, children }: AuthModalShellProps) {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    // biome-ignore lint/a11y/noStaticElementInteractions: overlay click to close
    // biome-ignore lint/a11y/useKeyWithClickEvents: overlay click to close
    <div
      ref={overlayRef}
      className="fixed inset-0 z-60 flex items-center justify-center bg-black/50 p-4"
      onClick={(e) => {
        if (e.target === overlayRef.current) onClose();
      }}
    >
      <div className="relative w-full max-w-md animate-in fade-in zoom-in-95 duration-200">
        {children}
      </div>
    </div>
  );
}

// ─── Controls view state and renders the correct step ───

export function AuthModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [view, setView] = useState<AuthView>("main");
  const [emailData, setEmailData] = useState<{
    email: string;
    verificationUUID: string;
  } | null>(null);

  const handleEmailSent = (data: {
    email: string;
    verificationUUID: string;
  }) => {
    setEmailData(data);
    setView("otp");
  };

  const handleBack = () => {
    if (view === "otp") {
      setView("email");
    } else {
      setView("main");
    }
  };

  const handleClose = () => {
    setView("main");
    setEmailData(null);
    onClose();
  };

  const handleSuccess = () => {
    setView("main");
    setEmailData(null);
    onClose();
  };

  return (
    <AuthModalShell isOpen={isOpen} onClose={handleClose}>
      <div className="rounded-2xl bg-white p-8 shadow-lg">
        <button
          type="button"
          onClick={handleClose}
          aria-label="Cerrar"
          className="absolute right-4 top-4 flex size-8 items-center justify-center rounded-full text-[#A0A5B5] transition-colors hover:bg-[#EBE7E7] hover:text-[#171717]"
        >
          <XIcon />
        </button>

        {view === "main" && (
          <AuthViewMain
            onEmailClick={() => setView("email")}
            onClose={handleClose}
          />
        )}

        {view === "email" && (
          <EmailLoginForm onEmailSent={handleEmailSent} onBack={handleClose} />
        )}

        {view === "otp" && emailData && (
          <OTPVerificationForm
            email={emailData.email}
            verificationUUID={emailData.verificationUUID}
            onSuccess={handleSuccess}
            onBack={handleBack}
          />
        )}
      </div>
    </AuthModalShell>
  );
}
