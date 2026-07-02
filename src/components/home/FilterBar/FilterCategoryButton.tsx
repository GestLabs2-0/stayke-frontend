import type { FilterItem } from "@/types/FilterBar";

interface FilterCategoryButtonProps extends Omit<FilterItem, "key"> {
  isSelected: boolean;
  onClick: () => void;
}

export const FilterCategoryButton = ({
  icon: Icon,
  label,
  isSelected,
  onClick,
}: FilterCategoryButtonProps) => {
  const fillColor = isSelected ? "#191C1E" : "#A0A5B5";

  return (
    <button
      type="button"
      onClick={onClick}
      className="flex flex-col items-center gap-1 cursor-pointer transition-all duration-200 md:hover:scale-110 md:hover:-translate-y-1"
    >
      <span style={{ color: fillColor }}>
        <Icon size={22} className="[&_path]:fill-current" />
      </span>
      <span
        className="text-[11px] font-medium leading-tight"
        style={{ color: fillColor }}
      >
        {label}
      </span>
    </button>
  );
};
