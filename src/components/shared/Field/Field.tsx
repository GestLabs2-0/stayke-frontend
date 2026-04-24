export const Field = ({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) => (
  <div className="flex flex-col gap-2">
    <label className="text-sm font-medium text-foreground">{label}</label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="rounded-md border border-border bg-background  px-3 py-2 shadow-sm  text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none transition-colors"
    />
  </div>
);
