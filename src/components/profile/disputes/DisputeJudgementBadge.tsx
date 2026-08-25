"use client";

import {
  DISPUTE_JUDGEMENT_LABELS,
  SEVERITY_LABELS,
} from "@/types/api/disputes";
import type { DisputeJudgementBadgeProps } from "@/types/profile/disputes";
import { DISPUTE_JUDGEMENT_BADGE_CLASSES } from "./disputeStatusStyles";

export function DisputeJudgementBadge({ dispute }: DisputeJudgementBadgeProps) {
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
