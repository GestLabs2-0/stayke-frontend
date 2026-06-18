export type SearchFieldProps = {
  label: string;
  placeholder: string;
  children: React.ReactNode;
  onClick?: () => void;
  isActive?: boolean;
};
