"use client";

import type { Variants } from "framer-motion";
import { AnimatePresence, motion } from "framer-motion";
import { Home as HomeIcon } from "lucide-react";

import { buildImageUrl } from "@/helpers/buildImageUrl";
import type { HostActivePropertiesProps } from "@/types/profile";
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

export function HostActiveProperties({
  properties,
  loading,
  onCreateProperty,
}: HostActivePropertiesProps) {
  const items = properties.slice(0, 3);

  return (
    <SectionCard
      icon={<HomeIcon className="size-4 text-accent-warm" />}
      title="Propiedades"
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
            {items.map((p, i) => (
              <motion.div
                key={p.id || p.pda || String(i)}
                variants={itemVariants}
              >
                <ListCard
                  image={buildImageUrl(p.imageUrl) ?? PLACEHOLDER_IMAGE}
                  title={p.title}
                  subtitle={[p.city, p.state ?? p.countryCode]
                    .filter(Boolean)
                    .join(", ")}
                  active={p.isActive ?? true}
                >
                  <span className="inline-block rounded-full bg-green-100 px-2 py-0.5 font-sans text-xs font-semibold uppercase tracking-wide text-green-700">
                    {p.isActive ? "Activa" : "Borrador"}
                  </span>
                </ListCard>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <EmptyState
            key="empty"
            message="No tienes propiedades activas publicadas todavía."
            description="Crea tu primera propiedad en la plataforma para empezar a recibir huéspedes y generar ingresos."
            action="Publicar propiedad"
            onAction={onCreateProperty}
          />
        )}
      </AnimatePresence>
    </SectionCard>
  );
}
