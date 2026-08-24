"use client";

import { useSendEmailOTP, useVerifyOTP } from "@dynamic-labs-sdk/react-hooks";
import type { ClipboardEvent } from "react";
import { useEffect, useRef, useState } from "react";

import type { EmailVerificationStepProps } from "@/types/auth";
import { EmailInputStep } from "./EmailInputStep";

const OTP_LENGTH = 6;

type Step = "input-email" | "input-otp";

export function EmailVerificationStep({
  onSuccess,
}: EmailVerificationStepProps) {
  const [step, setStep] = useState<Step>("input-email");
  const [email, setEmail] = useState("");
  const [verificationUUID, setVerificationUUID] = useState("");
  const [codes, setCodes] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const { mutate: vfy, isPending: vpend, error: vErr } = useVerifyOTP();
  const { mutate: resendOtp, isPending: isResending } = useSendEmailOTP();
  const [resendSuccess, setResendSuccess] = useState(false);

  useEffect(() => {
    if (step === "input-otp") inputRefs.current[0]?.focus();
  }, [step]);

  const handleEmailSent = (data: {
    email: string;
    verificationUUID: string;
  }) => {
    setEmail(data.email);
    setVerificationUUID(data.verificationUUID);
    setStep("input-otp");
  };

  const handleChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;
    const next = [...codes];
    next[index] = value;
    setCodes(next);
    if (value && index < OTP_LENGTH - 1) inputRefs.current[index + 1]?.focus();
  };
  const handleKeyDown = (index: number, key: string) => {
    if (key === "Backspace" && !codes[index] && index > 0)
      inputRefs.current[index - 1]?.focus();
  };
  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, OTP_LENGTH);
    const next = Array(OTP_LENGTH).fill("");
    for (let i = 0; i < pasted.length; i++) next[i] = pasted[i];
    setCodes(next);
    const focusIndex = Math.min(pasted.length, OTP_LENGTH - 1);
    inputRefs.current[focusIndex]?.focus();
  };
  const handleVerifyOTP = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    const code = codes.join("");
    if (code.length !== OTP_LENGTH) return;
    vfy(
      { otpVerification: { email, verificationUUID }, verificationToken: code },
      { onSuccess: () => onSuccess() },
    );
  };
  const handleResend = () =>
    resendOtp({ email }, { onSuccess: () => setResendSuccess(true) });

  if (step === "input-email") {
    return <EmailInputStep onEmailSent={handleEmailSent} />;
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="font-plus-jakarta text-lg font-bold text-white">
          Introduce el código
        </h2>
        <p className="mt-1 text-sm text-white/70">
          Te enviamos un código a{" "}
          <span className="font-semibold text-white">{email}</span>
        </p>
        <button
          type="button"
          onClick={() => {
            setStep("input-email");
            setCodes(Array(OTP_LENGTH).fill(""));
            setResendSuccess(false);
          }}
          className="mt-1 text-sm font-medium text-white/60 underline transition-colors hover:text-white/90"
        >
          Cambiar email
        </button>
      </div>
      <form onSubmit={handleVerifyOTP} className="space-y-4">
        <div className="flex justify-center gap-2">
          {codes.map((digit, i) => (
            <input
              // biome-ignore lint/suspicious/noArrayIndexKey: index
              key={i}
              ref={(el) => {
                inputRefs.current[i] = el;
              }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e.key)}
              onPaste={i === 0 ? handlePaste : undefined}
              aria-label={`Dígito ${i + 1} de 6`}
              autoComplete={i === 0 ? "one-time-code" : undefined}
              aria-describedby={i === 0 && vErr ? "otp-error" : undefined}
              className="size-10 rounded-[10px] border border-[#C3C6D6] bg-white text-center font-geist text-lg font-semibold text-[#171717] transition-shadow duration-150 focus-visible:outline-none focus-visible:shadow-[0_0_0_2px_rgba(59,0,127,0.4)]"
            />
          ))}
        </div>
        {vErr && (
          <p id="otp-error" className="text-center text-sm text-red-300">
            {vErr instanceof Error ? vErr.message : "Código inválido"}
          </p>
        )}
        <button
          type="submit"
          disabled={vpend || codes.join("").length !== OTP_LENGTH}
          className="w-full rounded-full bg-[#3B007F] px-4 py-3 font-plus-jakarta font-semibold text-white transition-colors hover:bg-[#5307ad] disabled:opacity-50"
        >
          {vpend ? "Verificando..." : "Verificar código"}
        </button>
      </form>
      <div className="text-center text-sm text-white/70">
        ¿No recibiste el código?{" "}
        <button
          type="button"
          onClick={handleResend}
          disabled={isResending}
          className="font-semibold text-white/80 transition-colors hover:text-white disabled:opacity-50"
        >
          {isResending ? "Reenviando..." : "Reenviar código"}
        </button>
        {resendSuccess && (
          <span className="ml-1 text-green-300">¡Enviado!</span>
        )}
      </div>
    </div>
  );
}
