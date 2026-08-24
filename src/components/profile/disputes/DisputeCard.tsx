"use client";

import { CalendarRange, Flag, ShieldAlert } from "lucide-react";

import { DisputeParty } from "@GestLabs2-0/stayke-disputes";
import { STATUS_BADGE_CLASSES } from "@/components/profile/bookings/bookingStatusStyles";
import { formatDate } from "@/helpers/formatDate";
import { formatPrice } from "@/helpers/formatPrice";
import { BOOKING_STATUS_LABELS } from "@/types/api/booking";
import type { Dispute } from "@/types/api/disputes";
import {
  DISPUTE_JUDGEMENT_LABELS,
  DISPUTE_STATE_LABELS,
  SEVERITY_LABELS,
} from "@/types/api/disputes";
import type {
  DisputeCardProps,
  UserRoleInDispute,
} from "@/types/profile/disputes";
import {
  DISPUTE_JUDGEMENT_BADGE_CLASSES,
  DISPUTE_STATE_CHIP_CLASSES,
  DISPUTE_STATE_ICONS,
} from "./disputeStatusStyles";

function userRoleInDispute(
  dispute: Dispute,
  userWallet: string | null,
): UserRoleInDispute {
  if (!userWallet) return null;

  const guestIsUser = dispute.booking.guest_profile_pda === userWallet;
  const hostIsUser = dispute.booking.host_profile_pda === userWallet;
  const openedByGuest = dispute.openedBy === DisputeParty.Guest;

  if (openedByGuest ? guestIsUser : hostIsUser) return "initiator";
  if (guestIsUser || hostIsUser) return "accused";
  return null;
}

function StatusChip({ dispute }: { dispute: Dispute }) {
  const StateIcon = DISPUTE_STATE_ICONS[dispute.state];
  return (
    <span
      className={`inline-flex size-11 shrink-0 items-center justify-center rounded-xl transition-transform duration-200 group-hover:scale-105 ${DISPUTE_STATE_CHIP_CLASSES[dispute.state]}`}
    >
      <StateIcon className="size-5" />
    </span>
  );
}

function JudgementBadge({ dispute }: { dispute: Dispute }) {
  if (dispute.judgement === null) return null;
  const label = DISPUTE_JUDGEMENT_LABELS[dispute.judgement];
  const severity =
    dispute.severity !== null ? SEVERITY_LABELS[dispute.severity] : null;

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 font-plus-jakarta text-xs font-semibold ${DISPUTE_JUDGEMENT_BADGE_CLASSES[dispute.judgement]}`}
    >
      {severity ? `${label} · ${severity}` : label}
    </span>
  );
}

function RoleTag({
  role,
  openedAt,
}: {
  role: UserRoleInDispute;
  openedAt: number;
}) {
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

/**
 * Tarjeta de una disputa: estado a simple vista (icono + etiqueta), fallo y
 * severidad cuando existen, y el rol del usuario autenticado.
 */
export function DisputeCard({ dispute, userWallet }: DisputeCardProps) {
  const role = userRoleInDispute(dispute, userWallet);
  const rangeLabel = `${formatDate(dispute.booking.checkIn)} – ${formatDate(
    dispute.booking.checkOut,
  )}`;
  const bookingStatus = dispute.booking.status;

  return (
    <article className="card-white group flex flex-col gap-4 p-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md sm:flex-row sm:items-center">
      <StatusChip dispute={dispute} />

      <div className="min-w-0 flex-1 space-y-1.5">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="font-plus-jakarta text-sm font-bold text-[#171717]">
            {DISPUTE_STATE_LABELS[dispute.state]}
          </h3>
          <JudgementBadge dispute={dispute} />
        </div>

        <p className="flex flex-wrap items-center gap-x-1.5 font-sans text-[13px] text-[#434654]">
          <CalendarRange
            className="size-3.5 shrink-0 text-muted"
            aria-hidden="true"
          />
          <span>{rangeLabel}</span>
          <span aria-hidden="true">·</span>
          <span className="font-semibold">
            {formatPrice(dispute.booking.totalPrice)}
          </span>
        </p>

        <div className="flex flex-wrap items-center gap-2">
          <RoleTag role={role} openedAt={dispute.openedAt} />
          {role !== null && (
            <span className="font-plus-jakarta text-[13px] font-semibold text-[#434654]">
              Iniciada el {formatDate(dispute.openedAt)}
            </span>
          )}
        </div>
      </div>

      <span
        className={`hidden shrink-0 self-start rounded-full px-2.5 py-0.5 font-plus-jakarta text-xs font-semibold sm:inline-flex ${STATUS_BADGE_CLASSES[bookingStatus]}`}
      >
        {BOOKING_STATUS_LABELS[bookingStatus]}
      </span>
    </article>
  );
}
