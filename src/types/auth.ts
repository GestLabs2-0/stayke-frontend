export type AuthView = "main" | "email" | "otp";

export interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface EmailFormProps {
  onEmailSent: (data: { email: string; verificationUUID: string }) => void;
  onBack?: () => void;
}

export interface OTPFormProps {
  email: string;
  verificationUUID: string;
  onSuccess?: () => void;
  onBack: () => void;
}
