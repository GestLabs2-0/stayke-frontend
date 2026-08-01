import type { InputHTMLAttributes } from "react";

export interface FormDateFieldProps
  extends InputHTMLAttributes<HTMLInputElement> {
  name: string;
  label: string;
}
