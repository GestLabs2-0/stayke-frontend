"use client";

import type { Variants } from "framer-motion";
import { AnimatePresence, motion } from "framer-motion";
import { Building2 } from "lucide-react";

import { buildImageUrl } from "@/helpers/buildImageUrl";
import { formatDate } from "@/helpers/formatDate";
import { fullName } from "@/helpers/profileNames";
import type { HostPastHostingsProps } from "@/types/profile";
import { EmptyState } from "./EmptyState";
import { ListCard } from "./ListCard";
import { ListCardSkeleton } from "./ListCardSkeleton";
import { SectionCard } from "./SectionCard";

const PLACEHOLDER_IMAGE = "/placeholder.jpg";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.25, ease: [0.16, 1, 0.3, 1] },
  },
};

export function HostPastHostings({
  bookings,
  loading,
  onCreateProperty,
}: HostPastHostingsProps) {
  const items = bookings.slice(0, 3);

  return (
    <SectionCard
      icon={<Building2 className="size-4 text-muted" />}
      title="Hostings anteriores"
    >
      <AnimatePresence mode="wait">
        {loading ? (
          <ListCardSkeleton key="skeleton" count={2} />
        ) : items.length > 0 ? (
          <motion.div
            key="list"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-3"
          >
            {items.map((h) => (
              <motion.div key={h.idPda} variants={itemVariants}>
                <ListCard
                  image={
                    buildImageUrl(h.property?.imageKey) ?? PLACEHOLDER_IMAGE
                  }
                  title={h.property?.title ?? "Alojamiento"}
                  subtitle={[h.property?.city, h.property?.countryCode]
                    .filter(Boolean)
                    .join(", ")}
                  active={false}
                >
                  <div className="flex flex-wrap gap-x-4 gap-y-1 font-sans text-xs">
                    <span className="text-[#a0a5b5]">
                      {formatDate(h.checkIn)} – {formatDate(h.checkOut)}
                    </span>
                    <span className="text-[#a0a5b5]">
                      {fullName(
                        h.guest?.name,
                        h.guest?.lastName,
                        h.guest?.userProfile,
                      )}
                    </span>
                  </div>
                </ListCard>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <EmptyState
            key="empty"
            message="No tienes hostings anteriores con fondos liberados."
            description="Comparte tu propiedad para recibir reservas y ganar dinero cuando se completen las estadías."
            action="Publicar propiedad"
            onAction={onCreateProperty}
          />
        )}
      </AnimatePresence>
    </SectionCard>
  );
}
