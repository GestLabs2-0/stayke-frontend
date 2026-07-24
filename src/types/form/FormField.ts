import type { InputHTMLAttributes } from "react";

export interface FormFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  name: string;
  label: string;
}
