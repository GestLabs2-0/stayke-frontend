import type { CreatePropertyFormValues } from "./createProperty";

export interface PropertyPreviewProps {
  open: boolean;
  onClose: () => void;
  values: CreatePropertyFormValues;
}
