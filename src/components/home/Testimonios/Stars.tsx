import { StarIcon } from "@/icons";

export const Stars = ({
  count,
  className = "text-purple-400",
}: {
  count: number;
  className?: string;
}) => {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <StarIcon
          key={i}
          filled={i <= count}
          className={`w-4 h-4 ${className}`}
        />
      ))}
    </div>
  );
};
