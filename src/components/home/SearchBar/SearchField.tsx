import type { SearchFieldProps } from "@/types/header";

export const SearchField = ({
  label,
  placeholder,
  children,
  onClick,
  isActive,
}: SearchFieldProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-3 pr-25 pl-8 py-4 transition-colors ${isActive ? "bg-zinc-100" : "hover:bg-zinc-50"}`}
    >
      <div className="w-6 h-6 text-purple-500 shrink-0">{children}</div>
      <div className="flex flex-col text-start">
        <span className="text-xs font-semibold text-zinc-500">{label}</span>
        <span className="text-base text-zinc-800">{placeholder}</span>
      </div>
    </button>
  );
};
