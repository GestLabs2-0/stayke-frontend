"use client";

import { useUpdateUser } from "@dynamic-labs-sdk/react-hooks";
import { useState } from "react";

import { MailIcon } from "@/icons/MailIcon";
import type { EmailFormProps } from "@/types/auth";

export function EmailInputStep({ onEmailSent }: EmailFormProps) {
  const [email, setEmail] = useState("");
  const { mutate: upd, isPending: send, error: eError } = useUpdateUser();

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email.trim()) return;
    upd(
      { userFields: { email: email.trim() } },
      {
        onSuccess: (data) => {
          if (data && "verificationUUID" in data && "email" in data) {
            onEmailSent({
              email: data.email as string,
              verificationUUID: data.verificationUUID as string,
            });
          }
        },
      },
    );
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="font-plus-jakarta text-lg font-bold text-white">
          Verifica tu email
        </h2>
        <p className="mt-1 text-sm text-white/70">
          Necesitamos tu correo para completar el registro
        </p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <MailIcon className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-[#A0A5B5]" />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="tu@email.com"
            required
            autoComplete="email"
            aria-describedby={eError ? "email-error" : undefined}
            className="w-full rounded-[10px] bg-[#EFF3F6] py-3 pl-11 pr-4 font-plus-jakarta text-[14px] font-semibold text-[#171717] placeholder:text-[#7C838F] focus-visible:outline-none transition-shadow duration-150 focus-visible:shadow-[0_0_0_2px_rgba(59,0,127,0.4)]"
          />
        </div>
        {eError && (
          <p id="email-error" className="text-sm text-red-300">
            {eError instanceof Error
              ? eError.message
              : "Error al enviar el código"}
          </p>
        )}
        <button
          type="submit"
          disabled={send || !email.trim()}
          className="w-full rounded-full bg-[#3B007F] px-4 py-3 font-plus-jakarta font-semibold text-white transition-colors hover:bg-[#5307ad] disabled:opacity-50"
        >
          {send ? "Enviando..." : "Enviar código"}
        </button>
      </form>
    </div>
  );
}
