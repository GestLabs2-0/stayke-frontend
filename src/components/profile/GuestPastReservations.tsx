"use client";

import type { Variants } from "framer-motion";
import { AnimatePresence, motion } from "framer-motion";
import { Clock } from "lucide-react";

import { buildImageUrl } from "@/helpers/buildImageUrl";
import { formatDate } from "@/helpers/formatDate";
import { formatPrice } from "@/helpers/formatPrice";
import type { GuestPastReservationsProps } from "@/types/profile";
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

export function GuestPastReservations({
  bookings,
  loading,
  onExplore,
}: GuestPastReservationsProps) {
  const items = bookings.slice(0, 2);

  return (
    <SectionCard
      icon={<Clock className="size-4 text-muted" />}
      title="Reservas anteriores"
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
            {items.map((r) => (
              <motion.div key={r.idPda} variants={itemVariants}>
                <ListCard
                  image={
                    buildImageUrl(r.property?.imageKey) ?? PLACEHOLDER_IMAGE
                  }
                  title={r.property?.title ?? "Alojamiento"}
                  subtitle={[r.property?.city, r.property?.countryCode]
                    .filter(Boolean)
                    .join(", ")}
                  active={false}
                >
                  <div className="flex flex-wrap gap-x-4 gap-y-1 font-sans text-xs">
                    <span className="text-[#a0a5b5]">
                      {formatDate(r.checkIn)} – {formatDate(r.checkOut)}
                    </span>
                    <span className="text-[#a0a5b5]">
                      {formatPrice(r.totalPrice)}
                    </span>
                  </div>
                </ListCard>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <EmptyState
            key="empty"
            message="Aún no tienes reservas anteriores."
            description="Descubre nuevos destinos y vive experiencias inolvidables en Stayke."
            action="Buscar destinos"
            onAction={onExplore}
          />
        )}
      </AnimatePresence>
    </SectionCard>
  );
}
