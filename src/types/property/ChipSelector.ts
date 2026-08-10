export interface ChipSelectorProps {
  label: string;
  options: readonly string[];
  selected: string[];
  onChange: (selected: string[]) => void;
  allowCustom?: boolean;
  placeholder?: string;
}
