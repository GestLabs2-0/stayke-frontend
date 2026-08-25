"use client";

import { AnimatePresence, motion } from "framer-motion";
import { CalendarDays } from "lucide-react";

import { buildImageUrl } from "@/helpers/buildImageUrl";
import { formatDate } from "@/helpers/formatDate";
import { formatPrice } from "@/helpers/formatPrice";
import { fullName } from "@/helpers/profileNames";
import type { GuestActiveReservationProps } from "@/types/profile";
import { EmptyState } from "./EmptyState";
import { ListCard } from "./ListCard";
import { ListCardSkeleton } from "./ListCardSkeleton";
import { SectionCard } from "./SectionCard";

const PLACEHOLDER_IMAGE = "/placeholder.jpg";

export function GuestActiveReservation({
  booking,
  loading,
  onExplore,
}: GuestActiveReservationProps) {
  return (
    <SectionCard
      icon={
        <CalendarDays
          className={`size-4 ${booking ? "text-accent-warm" : "text-muted"}`}
        />
      }
      title="Reserva activa"
      rightContent={
        booking ? (
          <motion.span
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-1 rounded-full bg-accent-warm/15 px-2 py-0.5 font-sans text-xs font-semibold text-accent-warm"
          >
            <span className="size-1.5 rounded-full bg-accent-warm" />
            Próximo
          </motion.span>
        ) : undefined
      }
    >
      <AnimatePresence mode="wait">
        {loading ? (
          <ListCardSkeleton key="skeleton" count={1} />
        ) : booking ? (
          <motion.div
            key={booking.idPda}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          >
            <ListCard
              image={
                buildImageUrl(booking.property?.imageKey) ?? PLACEHOLDER_IMAGE
              }
              title={booking.property?.title ?? "Alojamiento"}
              subtitle={[booking.property?.city, booking.property?.countryCode]
                .filter(Boolean)
                .join(", ")}
              active
            >
              <div className="flex flex-wrap gap-x-4 gap-y-1 font-sans text-xs">
                <span className="font-semibold text-accent-warm">
                  {formatDate(booking.checkIn)} – {formatDate(booking.checkOut)}
                </span>
                <span className="text-[#434654]">
                  Anfitrión:{" "}
                  {fullName(
                    booking.host?.name,
                    booking.host?.lastName,
                    booking.host?.userProfile,
                  )}
                </span>
              </div>
              <p className="mt-1.5 font-sans text-xs font-semibold text-[#171717]">
                Total: {formatPrice(booking.totalPrice)}
              </p>
            </ListCard>
          </motion.div>
        ) : (
          <EmptyState
            key="empty"
            message="No tienes una reserva activa en este momento."
            description="Explora alojamientos increíbles o comparte tu propia propiedad para ganar dinero con cada reserva."
            action="Explorar alojamientos"
            onAction={onExplore}
          />
        )}
      </AnimatePresence>
    </SectionCard>
  );
}
