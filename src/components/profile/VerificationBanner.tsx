"use client";

import { ShieldAlert } from "lucide-react";

export function VerificationBanner() {
  return (
    <div className="card-surface flex items-start gap-4">
      <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-accent-warm">
        <ShieldAlert className="size-5 text-white" />
      </div>
      <div className="flex-1">
        <p className="font-sans text-sm font-semibold text-[#171717]">
          Verifica tu identidad
        </p>
        <p className="mt-1 font-sans text-sm leading-relaxed text-[#434654]">
          Aumenta tu reputación y generá confianza en la comunidad verificando
          tu identidad con Didit.
        </p>
        <button
          type="button"
          className="mt-3 rounded-full bg-accent-warm px-5 py-2 font-sans text-xs font-semibold tracking-wide text-white uppercase transition-colors hover:bg-accent-warm-hover"
        >
          Verificar con Didit
        </button>
      </div>
    </div>
  );
}
