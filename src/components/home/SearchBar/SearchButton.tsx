import { SearchIcon } from "@/icons";
import type { SearchButtonProps } from "@/types/header";

export const SearchButton = ({
  onClick,
  disabled,
  className = "",
  showText = false,
}: SearchButtonProps) => {
  return (
    <div className={`px-2.5 py-2 shrink-0 ${className}`}>
      <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        aria-label="Buscar alojamientos"
        className="bg-[#3b007f] hover:bg-[#5307ad] active:scale-95 disabled:opacity-50 text-white p-3.5 lg:p-4 rounded-full transition-all duration-200 cursor-pointer flex items-center justify-center shadow-md hover:shadow-lg hover:scale-105 gap-2"
      >
        <SearchIcon />
        {showText && (
          <span className="font-montserrat font-bold text-sm pr-1">Buscar</span>
        )}
      </button>
    </div>
  );
};
