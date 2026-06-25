import { StarIcon } from "@/icons";
import type { TestimonioCardProps } from "@/types/testimonios";

const Stars = ({ count }: { count: number }) => {
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

export const TestimonioCard = ({ testimonio }: TestimonioCardProps) => {
  return (
    <div className="flex flex-col justify-between gap-4 bg-purple-950 rounded-2xl p-6 shadow-lg text-white">
      {/* Estrellas */}
      <Stars count={testimonio.stars} />

      {/* Texto */}
      <p className="font-sans text-sm leading-relaxed flex-1">
        {testimonio.text}
      </p>

      {/* Autor */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-purple-500/30 flex items-center justify-center text-sm font-bold text-purple-200">
          {testimonio.avatar}
        </div>
        <div className="flex flex-col">
          <span className="font-sans text-sm font-bold text-white">
            {testimonio.author}
          </span>
          <span className="font-sans text-xs text-purple-200/70">
            {testimonio.title}
          </span>
        </div>
      </div>
    </div>
  );
};
