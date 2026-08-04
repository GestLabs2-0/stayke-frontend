"use client";

import { useSendEmailOTP } from "@dynamic-labs-sdk/react-hooks";
import type { FormEvent } from "react";
import { useState } from "react";

import { ChevronLeftIcon } from "@/icons/ChevronLeftIcon";
import { MailIcon } from "@/icons/MailIcon";
import type { EmailFormProps } from "@/types/auth";

export function EmailLoginForm({ onEmailSent, onBack }: EmailFormProps) {
  const [email, setEmail] = useState("");
  const { mutate: sendOtp, isPending, error } = useSendEmailOTP();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    sendOtp(
      { email: email.trim() },
      {
        onSuccess: (data) => {
          onEmailSent({
            email: email.trim(),
            verificationUUID: data.verificationUUID,
          });
        },
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
          Correo electrónico
        </h2>
        <p className="mt-1 text-sm text-[#434654]">
          Te enviaremos un código de verificación
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <MailIcon className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-[#A0A5B5]" />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="tu@email.com"
            required
            className="w-full rounded-xl border border-[#C3C6D6] bg-white py-3 pl-11 pr-4 font-geist text-sm text-[#171717] placeholder:text-[#A0A5B5] transition-all focus:border-[#3B007F] focus:outline-none focus:ring-2 focus:ring-[#3B007F]/30"
          />
        </div>

        {error && (
          <p className="text-sm text-red-500">
            {error instanceof Error
              ? error.message
              : "Error al enviar el código"}
          </p>
        )}

        <button
          type="submit"
          disabled={isPending || !email.trim()}
          className="w-full rounded-xl bg-[#3B007F] px-4 py-3 font-plus-jakarta font-semibold text-white transition-colors hover:bg-[#5307ad] disabled:opacity-50"
        >
          {isPending ? "Enviando..." : "Enviar código"}
        </button>
      </form>
    </div>
  );
}
