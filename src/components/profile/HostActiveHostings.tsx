"use client";

import type { Variants } from "framer-motion";
import { AnimatePresence, motion } from "framer-motion";
import { Building2 } from "lucide-react";

import { buildImageUrl } from "@/helpers/buildImageUrl";
import { formatDate } from "@/helpers/formatDate";
import { fullName } from "@/helpers/profileNames";
import type { HostActiveHostingsProps } from "@/types/profile";
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

export function HostActiveHostings({
  bookings,
  loading,
  onCreateProperty,
}: HostActiveHostingsProps) {
  const items = bookings.slice(0, 3);

  return (
    <SectionCard
      icon={<Building2 className="size-4 text-accent-warm" />}
      title="Hostings activos"
      rightContent={
        <span className="rounded-full bg-accent-warm/15 px-2 py-0.5 font-sans text-xs font-semibold text-accent-warm">
          {items.length}/3
        </span>
      }
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
                  active
                >
                  <div className="flex flex-wrap gap-x-4 gap-y-1 font-sans text-xs">
                    <span className="font-semibold text-accent-warm">
                      Check-in: {formatDate(h.checkIn)}
                    </span>
                    <span className="text-[#434654]">
                      Huésped:{" "}
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
            message="No tienes hostings activos en este momento."
            description="Comparte tu propiedad en Stayke para recibir reservas y ganar dinero como anfitrión."
            action="Publicar propiedad"
            onAction={onCreateProperty}
          />
        )}
      </AnimatePresence>
    </SectionCard>
  );
}
