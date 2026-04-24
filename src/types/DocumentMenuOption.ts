export interface DocumentTypeOption {
  value: string;
  label: string;
  icon?: string;
}

export interface DocumentTypeSelectorProps {
  id: string;
  open: boolean;
  onToggle: () => void;
  onChange: (value: string) => void;
  selectedValue: DocumentTypeOption | null;
}
