import { StarIcon } from "@/icons";

export const Stars = ({ count }: { count: number }) => {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <StarIcon
          key={i}
          filled={i <= count}
          className="w-4 h-4 text-purple-400"
        />
      ))}
    </div>
  );
};
