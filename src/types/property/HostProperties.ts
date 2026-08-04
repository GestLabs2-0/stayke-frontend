import type { HostProperty } from "./hostProperty";
import type { PropertyFilters } from "./propertyFilters";

export interface HostPropertiesActions {
  onEdit: (property: HostProperty) => void;
  onToggleActive: (property: HostProperty) => void;
  onCreate: () => void;
}

export interface HostPropertyCardProps {
  property: HostProperty;
  onEdit: (property: HostProperty) => void;
  onToggleActive: (property: HostProperty) => void;
}

export interface HostPropertyFiltersProps {
  values: PropertyFilters;
  onChange: <K extends keyof PropertyFilters>(
    field: K,
    value: PropertyFilters[K],
  ) => void;
  onReset: () => void;
  resultCount: number;
  totalCount: number;
}

export interface HostPropertyConfirmDialogProps {
  open: boolean;
  property: HostProperty | null;
  onClose: () => void;
  onConfirm: () => void;
}

export interface HostPropertyListProps {
  properties: HostProperty[];
  totalCount: number;
  onEdit: (property: HostProperty) => void;
  onToggleActive: (property: HostProperty) => void;
  onCreate: () => void;
  onClearFilters: () => void;
}
