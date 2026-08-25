"use client";

import type { DisputeStatusChipProps } from "@/types/profile/disputes";
import {
  DISPUTE_STATE_CHIP_CLASSES,
  DISPUTE_STATE_ICONS,
} from "./disputeStatusStyles";

export function DisputeStatusChip({ dispute }: DisputeStatusChipProps) {
  const StateIcon = DISPUTE_STATE_ICONS[dispute.state];
  return (
    <span
      className={`inline-flex size-11 shrink-0 items-center justify-center rounded-xl transition-transform duration-200 group-hover:scale-105 ${DISPUTE_STATE_CHIP_CLASSES[dispute.state]}`}
    >
      <StateIcon className="size-5" />
    </span>
  );
}
