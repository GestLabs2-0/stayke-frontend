import type { SelectHTMLAttributes } from "react";

export interface FormSelectProps
  extends SelectHTMLAttributes<HTMLSelectElement> {
  name: string;
  label: string;
  placeholder: string;
  options: { value: string; label: string }[];
}
