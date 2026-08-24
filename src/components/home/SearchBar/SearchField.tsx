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
      className={`flex-1 min-w-0 flex items-center gap-3 px-5 lg:px-6 py-3.5 lg:py-4 transition-all duration-150 text-left cursor-pointer group ${
        isActive ? "bg-zinc-100/90 shadow-inner" : "hover:bg-zinc-50"
      }`}
    >
      <div className="w-8 h-8 rounded-full bg-purple-50 text-[#3b007f] flex items-center justify-center shrink-0 group-hover:bg-purple-100 transition-colors">
        <div className="w-4 h-4">{children}</div>
      </div>
      <div className="flex flex-col text-start min-w-0 flex-1">
        <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider leading-none mb-1">
          {label}
        </span>
        <span className="text-sm lg:text-[15px] font-semibold text-zinc-900 truncate">
          {placeholder}
        </span>
      </div>
    </button>
  );
};
