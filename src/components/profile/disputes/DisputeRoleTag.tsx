"use client";

import { Flag, ShieldAlert } from "lucide-react";

import { formatDate } from "@/helpers/formatDate";
import type { DisputeRoleTagProps } from "@/types/profile/disputes";

export function DisputeRoleTag({ role, openedAt }: DisputeRoleTagProps) {
  if (role === "initiator") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-1">
        <Flag className="size-3.5 text-primary" aria-hidden="true" />
        <span className="font-plus-jakarta text-[13px] font-bold text-[#171717]">
          Iniciaste
        </span>
      </span>
    );
  }

  if (role === "accused") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-accent-warm/10 px-2.5 py-1">
        <ShieldAlert
          className="size-3.5 text-accent-warm-hover"
          aria-hidden="true"
        />
        <span className="font-plus-jakarta text-[13px] font-bold text-[#171717]">
          En tu contra
        </span>
      </span>
    );
  }

  return (
    <span className="font-plus-jakarta text-[13px] font-semibold text-[#434654]">
      Iniciada el {formatDate(openedAt)}
    </span>
  );
}
