"use client";

import { useSendEmailOTP, useVerifyOTP } from "@dynamic-labs-sdk/react-hooks";
import type { ClipboardEvent, SubmitEvent } from "react";
import { useRef, useState } from "react";

import { ChevronLeftIcon } from "@/icons/ChevronLeftIcon";
import type { OTPFormProps } from "@/types/auth";

const OTP_LENGTH = 6;

export function OTPVerificationForm({
  email,
  verificationUUID,
  onSuccess,
  onBack,
}: OTPFormProps) {
  const [codes, setCodes] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const { mutate: verifyCode, isPending, error: verifyError } = useVerifyOTP();
  const { mutate: resendOtp, isPending: isResending } = useSendEmailOTP();
  const [resendSuccess, setResendSuccess] = useState(false);

  const code = codes.join("");

  const handleChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;

    const next = [...codes];
    next[index] = value;
    setCodes(next);

    if (value && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, key: string) => {
    if (key === "Backspace" && !codes[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, OTP_LENGTH);
    const next = Array(OTP_LENGTH).fill("");
    for (let i = 0; i < pasted.length; i++) {
      next[i] = pasted[i];
    }
    setCodes(next);
    const focusIndex = Math.min(pasted.length, OTP_LENGTH - 1);
    inputRefs.current[focusIndex]?.focus();
  };

  const handleSubmit = (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (code.length !== OTP_LENGTH) return;

    verifyCode(
      {
        otpVerification: { email, verificationUUID },
        verificationToken: code,
      },
      { onSuccess: () => onSuccess?.() },
    );
  };

  const handleResend = () => {
    resendOtp(
      { email },
      {
        onSuccess: () => setResendSuccess(true),
      },
    );
  };

  return (
    <div className="space-y-6">
      <button
        type="button"
        onClick={onBack}
        className="flex items-center gap-1 text-sm text-[#434654] transition-colors hover:text-[#171717]"
      >
        <ChevronLeftIcon className="w-4 h-4" />
        Volver
      </button>

      <div className="text-center">
        <h2 className="font-plus-jakarta text-lg font-bold text-[#171717]">
          Introduce el código
        </h2>
        <p className="mt-1 text-sm text-[#434654]">
          Te enviamos un código a{" "}
          <span className="font-medium text-[#171717]">{email}</span>
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
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
              // autoFocus={i === 0}
              className="size-10 rounded-xl border border-[#C3C6D6] bg-white text-center font-geist text-lg font-semibold text-[#171717] transition-all focus:border-[#3B007F] focus:outline-none focus:ring-2 focus:ring-[#3B007F]/30"
            />
          ))}
        </div>

        {verifyError && (
          <p className="text-center text-sm text-red-500">
            {verifyError instanceof Error
              ? verifyError.message
              : "Código inválido"}
          </p>
        )}

        <button
          type="submit"
          disabled={isPending || code.length !== OTP_LENGTH}
          className="w-full rounded-xl bg-[#3B007F] px-4 py-3 font-plus-jakarta font-semibold text-white transition-colors hover:bg-[#5307ad] disabled:opacity-50"
        >
          {isPending ? "Verificando..." : "Verificar código"}
        </button>
      </form>

      <div className="text-center text-sm text-[#434654]">
        ¿No recibiste el código?{" "}
        <button
          type="button"
          onClick={handleResend}
          disabled={isResending}
          className="font-semibold text-[#3B007F] transition-colors hover:text-[#5307ad] disabled:opacity-50"
        >
          {isResending ? "Reenviando..." : "Reenviar"}
        </button>
        {resendSuccess && (
          <span className="ml-1 text-green-600">¡Enviado!</span>
        )}
      </div>
    </div>
  );
}
