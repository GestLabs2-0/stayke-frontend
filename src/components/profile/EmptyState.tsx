"use client";

import { Inbox } from "lucide-react";

import type { EmptyStateProps } from "@/types/profile";

export function EmptyState({
  message,
  description,
  action,
  onAction,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl bg-[#ebe7e7] px-6 py-12 text-center">
      <Inbox className="float-icon size-8 text-accent-warm" />
      <p className="mt-3 font-sans text-sm font-semibold text-[#171717]">
        {message}
      </p>
      {description && (
        <p className="mt-1 font-sans text-xs text-[#434654]">{description}</p>
      )}
      {action && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="mt-4 rounded-full bg-accent-warm px-5 py-2 font-sans text-xs font-semibold tracking-wide text-white uppercase transition-colors hover:bg-accent-warm-hover"
        >
          {action}
        </button>
      )}
    </div>
  );
}
