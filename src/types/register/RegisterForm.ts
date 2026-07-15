export interface RegisterFormData {
  email: string;
}

export interface SocialProvider {
  id: string;
  name: string;
  icon: string;
  enabled: boolean;
}

export interface RegisterCardProps {
  onBack?: () => void;
  onSubmit?: (data: RegisterFormData) => void;
  onSocialLogin?: (providerId: string) => void;
}
