"use client";

import { Wallet } from "lucide-react";

import type { TreasuryCardProps } from "@/types/profile";

export function TreasuryCard({ balanceUsd }: TreasuryCardProps) {
  const formatted = new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(balanceUsd);

  return (
    <div className="card-white">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-sans text-xs font-semibold text-[#434654] uppercase tracking-wide">
            Tu saldo
          </p>
          <p className="mt-1 font-montserrat text-2xl font-bold text-[#171717]">
            {formatted}
          </p>
          <p className="mt-0.5 font-sans text-xs text-[#a0a5b5]">
            Disponible para reservas y retiros
          </p>
        </div>
        <div className="flex size-10 items-center justify-center rounded-full bg-accent-warm/15">
          <Wallet className="size-5 text-accent-warm" />
        </div>
      </div>
    </div>
  );
}
