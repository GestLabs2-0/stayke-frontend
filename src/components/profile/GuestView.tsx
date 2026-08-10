"use client";

import { CalendarDays, Clock } from "lucide-react";

import type { GuestViewProps } from "@/types/profile";
import { EmptyState } from "./EmptyState";
import { ListCard } from "./ListCard";
import { SectionCard } from "./SectionCard";

export function GuestView({ reservations }: GuestViewProps) {
  const active = reservations.find((r) => r.active);
  const past = reservations.filter((r) => !r.active);

  return (
    <div className="space-y-6">
      <SectionCard
        icon={
          <CalendarDays
            className={`size-4 ${active ? "text-accent-warm" : "text-muted"}`}
          />
        }
        title="Reserva activa"
        rightContent={
          active ? (
            <span className="flex items-center gap-1 rounded-full bg-accent-warm/15 px-2 py-0.5 font-sans text-xs font-semibold text-accent-warm">
              <span className="size-1.5 rounded-full bg-accent-warm" />
              Próximo
            </span>
          ) : undefined
        }
      >
        {active ? (
          <ListCard
            image={active.image}
            title={active.propertyName}
            subtitle={active.location}
            active
          >
            <div className="flex flex-wrap gap-x-4 gap-y-1 font-sans text-xs">
              <span className="font-semibold text-accent-warm">
                {active.checkIn} – {active.checkOut}
              </span>
              <span className="text-[#434654]">Anfitrión: {active.host}</span>
            </div>
            <p className="mt-1.5 font-sans text-xs font-semibold text-[#171717]">
              Total: ${active.totalUsd.toLocaleString("es-CO")} USD
            </p>
          </ListCard>
        ) : (
          <EmptyState
            message="Todavía no tenés una reserva activa."
            description="Cuando hagas una reserva, aparecerá acá."
          />
        )}
      </SectionCard>

      <SectionCard
        icon={<Clock className="size-4 text-muted" />}
        title="Reservas anteriores"
      >
        {past.length > 0 ? (
          <div className="list-stagger space-y-3">
            {past.map((r, i) => (
              <div key={r.id} style={{ animationDelay: `${i * 40}ms` }}>
                <ListCard
                  image={r.image}
                  title={r.propertyName}
                  subtitle={r.location}
                  active={false}
                >
                  <div className="flex flex-wrap gap-x-4 gap-y-1 font-sans text-xs">
                    <span className="text-[#a0a5b5]">
                      {r.checkIn} – {r.checkOut}
                    </span>
                    <span className="text-[#a0a5b5]">
                      ${r.totalUsd.toLocaleString("es-CO")} USD
                    </span>
                  </div>
                </ListCard>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            message="Aún no hay reservas anteriores."
            description="Revisá las propiedades cerca de tus favoritos."
          />
        )}
      </SectionCard>
    </div>
  );
}
