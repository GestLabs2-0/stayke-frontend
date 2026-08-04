"use client";

import { EmptyState } from "@/components/profile/EmptyState";
import { HostPropertyCard } from "@/components/profile/properties/listProperties/HostPropertyCard";
import type { HostPropertyListProps } from "@/types/property/HostProperties";

export function HostPropertyList({
  properties,
  totalCount,
  onEdit,
  onToggleActive,
  onCreate,
  onClearFilters,
}: HostPropertyListProps) {
  if (properties.length === 0) {
    return totalCount === 0 ? (
      <EmptyState
        message="No publicaste ninguna propiedad todavía."
        description="Creá tu primera propiedad para empezar a recibir huéspedes."
        action="Publicar propiedad"
        onAction={onCreate}
      />
    ) : (
      <EmptyState
        message="No se encontraron propiedades para los filtros."
        description="Probá ajustar o limpiar los filtros."
        action="Limpiar filtros"
        onAction={onClearFilters}
      />
    );
  }

  return (
    <div className="space-y-3">
      {properties.map((property) => (
        <HostPropertyCard
          key={property.id}
          property={property}
          onEdit={onEdit}
          onToggleActive={onToggleActive}
        />
      ))}
    </div>
  );
}
