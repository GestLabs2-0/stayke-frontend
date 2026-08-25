"use client";

import type {
  GuestBookingAction,
  GuestBookingActionId,
} from "@/types/profile/bookings";

const PRIMARY_BUTTON =
  "bg-primary text-white hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40";
const DANGER_BUTTON =
  "border border-red-200 bg-white text-red-600 hover:bg-red-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-300";

interface GuestBookingActionsProps {
  actions: GuestBookingAction[];
  /** Acción en curso para mostrar "Enviando…" (null si ninguna). */
  busy: GuestBookingActionId | null;
  onAction: (action: GuestBookingAction) => void;
}

/** Columna de botones de acción de la reserva del huésped. */
export function GuestBookingActions({
  actions,
  busy,
  onAction,
}: GuestBookingActionsProps) {
  if (actions.length === 0) return null;

  return (
    <div className="flex w-full shrink-0 flex-col gap-2 sm:w-44">
      {actions.map((action) => {
        const Icon = action.icon;
        const isBusy = busy === action.id;
        return (
          <button
            key={action.label}
            type="button"
            onClick={() => onAction(action)}
            disabled={action.disabled || isBusy}
            title={action.disabled ? action.hint : undefined}
            className={`inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-full px-4 py-2.5 font-plus-jakarta text-[13px] font-semibold transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-50 ${action.variant === "primary" ? PRIMARY_BUTTON : DANGER_BUTTON}`}
          >
            <Icon className="size-4" />
            {isBusy ? "Enviando…" : action.label}
          </button>
        );
      })}
    </div>
  );
}
