import { SearchIcon } from "@/icons";

export interface SearchButtonProps {
  onClick?: () => void;
  disabled?: boolean;
}

export const SearchButton = ({ onClick, disabled }: SearchButtonProps) => {
  return (
    <div className="px-3">
      <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        aria-label="Buscar alojamientos"
        className="bg-purple-600 hover:bg-purple-700 active:bg-purple-800 disabled:opacity-50 text-white p-3 rounded-full transition-all duration-150 cursor-pointer flex items-center justify-center shadow-md hover:shadow-lg hover:scale-105"
      >
        <SearchIcon />
      </button>
    </div>
  );
};
