import { SearchIcon } from "@/icons";

export const SearchButton = () => {
  return (
    <div className="px-3">
      <button
        type="button"
        className="bg-purple-600
 hover:bg-purple-700 text-white p-3 rounded-full transition-colors"
      >
        <SearchIcon />
      </button>
    </div>
  );
};
