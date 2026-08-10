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
}

export interface HostPropertyConfirmDialogProps {
  open: boolean;
  property: HostProperty | null;
  onClose: () => void;
  onConfirm: () => void;
}

export interface HostPropertyPaginationProps {
  pageIndex: number;
  pages: number;
  loading: boolean;
  onPrevious: () => void;
  onNext: () => void;
}

export interface HostPropertyListProps {
  properties: HostProperty[];
  totalCount: number;
  loading: boolean;
  onEdit: (property: HostProperty) => void;
  onToggleActive: (property: HostProperty) => void;
  onCreate: () => void;
  onClearFilters: () => void;
}

export type PropertiesStateI = {
  filters: PropertyFilters;
  properties: HostProperty[];
  totalCount: number;
  pages: number;
  pageIndex: number;
  loading: boolean;
};

export type PropertiesReducerActions =
  | {
      type: "update_filter";
      payload: Partial<PropertyFilters>;
    }
  | { type: "increment_page_index" }
  | { type: "reduce_page_index" }
  | { type: "reset_filter" }
  | {
      type: "set_properties";
      payload: {
        properties: HostProperty[];
        totalCount: number;
        pages: number;
      };
    }
  | { type: "set_loading"; loading: boolean };
