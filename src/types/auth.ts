import type { ReactNode } from "react";
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

export interface AuthViewMainProps {
  onEmailClick: () => void;
  onClose: () => void;
}
export interface AuthModalShellProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

export interface EmailVerificationStepProps {
  onSuccess: () => void;
}

export interface DynamicSessionType {
  value: {
    captchaToken: null | string;
    elevatedAccessTokens: string[];
    legacyToken: string;
    mfaToken: null | string;
    sessionExpiration: number;
    sessionKeys: string;
    token: string;
  };
}
