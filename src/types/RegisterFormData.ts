export type Role = "host" | "client";

export interface RegisterFormData {
  firstName: string;
  lastName: string;
  country: string;
  documentType: string;
  documentNumber: string | number;
  email: string;
  phone: string;
  address: string;
  image: string;
}

export type StepRenderer = (props: {
  form: RegisterFormData;
  onChange: <K extends keyof RegisterFormData>(
    field: K,
    value: RegisterFormData[K]
  ) => void;
}) => React.ReactNode;
