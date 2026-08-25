"use client";

import { CalendarRange } from "lucide-react";

import { STATUS_BADGE_CLASSES } from "@/components/profile/bookings/bookingStatusStyles";
import { userRoleInDispute } from "@/helpers/disputeRole";
import { formatDate } from "@/helpers/formatDate";
import { formatPrice } from "@/helpers/formatPrice";
import { useWalletContext } from "@/hooks/useWallet";
import { BOOKING_STATUS_LABELS } from "@/types/api/booking";
import { DISPUTE_STATE_LABELS } from "@/types/api/disputes";
import type { DisputeCardProps } from "@/types/profile/disputes";
import { DisputeActions } from "./DisputeActions";
import { DisputeJudgementBadge } from "./DisputeJudgementBadge";
import { DisputeRoleTag } from "./DisputeRoleTag";
import { DisputeStatusChip } from "./DisputeStatusChip";

/**
 * Tarjeta de una disputa: estado a simple vista, fallo y severidad, rol,
 * y acciones operativas (chat, resolución P2P, escalamiento y cierre).
 */
export function DisputeCard({
  dispute,
  userWallet,
  onRefresh,
}: DisputeCardProps) {
  const { userProfile } = useWalletContext();
  const userProfileAddress = userProfile?.address
    ? String(userProfile.address)
    : null;
  const role = userRoleInDispute(dispute, userWallet, userProfileAddress);
  const rangeLabel = `${formatDate(dispute.booking.checkIn)} – ${formatDate(
    dispute.booking.checkOut,
  )}`;
  const bookingStatus = dispute.booking.status;

  return (
    <article className="card-white group flex flex-col gap-4 p-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <DisputeStatusChip dispute={dispute} />

        <div className="min-w-0 flex-1 space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-plus-jakarta text-sm font-bold text-[#171717]">
              {DISPUTE_STATE_LABELS[dispute.state]}
            </h3>
            <DisputeJudgementBadge dispute={dispute} />
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
            <DisputeRoleTag role={role} openedAt={dispute.openedAt} />
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
      </div>

      <div className="flex items-center justify-end border-t border-[#ebe7e7]/60 pt-3">
        <DisputeActions
          dispute={dispute}
          userRole={role}
          onRefresh={onRefresh}
        />
      </div>
    </article>
  );
}
