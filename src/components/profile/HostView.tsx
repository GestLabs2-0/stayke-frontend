"use client";

import { Building2, Home as HomeIcon } from "lucide-react";
import { useRouter } from "next/navigation";

import type { HostViewProps } from "@/types/profile";
import { EmptyState } from "./EmptyState";
import { ListCard } from "./ListCard";
import { SectionCard } from "./SectionCard";

export function HostView({ hostings, properties }: HostViewProps) {
  const router = useRouter();
  const active = hostings.filter((h) => h.active);
  const past = hostings.filter((h) => !h.active);

  return (
    <div className="space-y-6">
      <SectionCard
        icon={<Building2 className="size-4 text-accent-warm" />}
        title="Hostings activos"
        rightContent={
          <span className="rounded-full bg-accent-warm/15 px-2 py-0.5 font-sans text-xs font-semibold text-accent-warm">
            {active.length}/3
          </span>
        }
      >
        {active.length > 0 ? (
          <div className="list-stagger space-y-3">
            {active.slice(0, 3).map((h, i) => (
              <div key={h.id} style={{ animationDelay: `${i * 40}ms` }}>
                <ListCard
                  image={h.image}
                  title={h.propertyName}
                  subtitle={h.location}
                  active
                >
                  <div className="flex flex-wrap gap-x-4 gap-y-1 font-sans text-xs">
                    <span className="font-semibold text-accent-warm">
                      Check-in: {h.checkIn}
                    </span>
                    <span className="text-[#434654]">Huésped: {h.guest}</span>
                  </div>
                </ListCard>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            message="No tenés hostings activos en este momento."
            description="Cuando un huésped reserve, aparecerá acá."
          />
        )}
      </SectionCard>

      {past.length > 0 && (
        <SectionCard
          icon={<Building2 className="size-4 text-muted" />}
          title="Hostings anteriores"
        >
          <div className="list-stagger space-y-3">
            {past.map((h, i) => (
              <div key={h.id} style={{ animationDelay: `${i * 40}ms` }}>
                <ListCard
                  image={h.image}
                  title={h.propertyName}
                  subtitle={h.location}
                  active={false}
                >
                  <div className="flex flex-wrap gap-x-4 gap-y-1 font-sans text-xs">
                    <span className="text-[#a0a5b5]">
                      {h.checkIn} – {h.checkOut}
                    </span>
                    <span className="text-[#a0a5b5]">{h.guest}</span>
                  </div>
                </ListCard>
              </div>
            ))}
          </div>
        </SectionCard>
      )}

      <SectionCard
        icon={<HomeIcon className="size-4 text-accent-warm" />}
        title="Propiedades"
      >
        {properties.length > 0 ? (
          <div className="list-stagger space-y-3">
            {properties.map((p, i) => (
              <div key={p.id} style={{ animationDelay: `${i * 40}ms` }}>
                <ListCard
                  image={p.image}
                  title={p.name}
                  subtitle={p.location}
                  active={p.published}
                >
                  <span
                    className={`inline-block rounded-full px-2 py-0.5 font-sans text-xs font-semibold tracking-wide uppercase ${
                      p.published
                        ? "bg-green-100 text-green-700"
                        : "bg-[#ebe7e7] text-[#a0a5b5]"
                    }`}
                  >
                    {p.published ? "Publicada" : "Borrador"}
                  </span>
                </ListCard>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            message="No publicaste ninguna propiedad todavía."
            description="Creá tu primera propiedad para empezar a recibir huéspedes."
            action="Publicar propiedad"
            onAction={() => router.push("/properties/new")}
          />
        )}
      </SectionCard>
    </div>
  );
}
