"use client";

import type { DisputeSectionProps } from "@/types/profile/disputes";
import { DisputeList } from "./DisputeList";
import { DISPUTE_KIND_DOT_CLASSES } from "./disputeStatusStyles";

/**
 * Sección de disputas con su propia cabecera (punto de color, título,
 * descripción y contador) y su propia lista con paginación independiente.
 */
export function DisputeSection({
  kind,
  title,
  description,
  disputes,
  userWallet,
  loading = false,
  emptyMessage,
  emptyDescription,
}: DisputeSectionProps) {
  return (
    <section className="space-y-3">
      <div className="flex flex-wrap items-center gap-2.5">
        <span
          aria-hidden="true"
          className={`size-2.5 rounded-full ${DISPUTE_KIND_DOT_CLASSES[kind]}`}
        />
        <div>
          <h2 className="font-montserrat text-lg font-bold text-foreground">
            {title}
          </h2>
          {description && (
            <p className="font-sans text-[13px] text-[#434654]">
              {description}
            </p>
          )}
        </div>
        {disputes.length > 0 && (
          <span className="ml-auto rounded-full bg-primary/10 px-2.5 py-0.5 font-sans text-xs font-semibold text-primary">
            {disputes.length}
          </span>
        )}
      </div>

      <DisputeList
        disputes={disputes}
        userWallet={userWallet}
        loading={loading}
        emptyMessage={emptyMessage}
        emptyDescription={emptyDescription}
      />
    </section>
  );
}
