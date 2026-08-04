export interface RegisterFormData {
  email: string;
  nombre: string;
  apellido: string;
  telefono: string;
  direccion: string;
  pais: string;
}

export interface RegisterCardProps {
  onBack?: () => void;
  onSubmit?: (data: RegisterFormData) => void;
}
