export interface ImageUploadProps {
  images: File[];
  onChange: (files: File[]) => void;
  maxImages?: number;
}
