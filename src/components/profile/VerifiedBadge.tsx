"use client";

import { ShieldCheck } from "lucide-react";

export function VerifiedBadge() {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-accent-warm px-2 py-0.5 text-xs font-semibold tracking-wide text-white uppercase">
      <ShieldCheck className="size-3" />
      Verificado
    </span>
  );
}
