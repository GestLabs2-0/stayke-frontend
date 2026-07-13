import Image from "next/image";
import type { TestimonioCardProps } from "@/types/testimonios";
import { Stars } from "./Stars";

export const TestimonioCard = ({ testimonio }: TestimonioCardProps) => {
  return (
    <div className="lg:flex flex-col bg-purple-deep rounded-2xl p-6 shadow-lg text-white max-[700px]:h-80 inline-flex first:ml-0 mr-5 max-[700px]:max-w-70 max-lg:max-w-80">
      {/* Estrellas */}
      <Stars count={testimonio.stars} />

      {/* Texto scrolleable */}
      <p className="font-sans text-sm leading-relaxed flex-1 overflow-y-auto my-4 min-h-0 scrollbar-hide">
        {testimonio.text}
      </p>

      {/* Autor (siempre visible al fondo) */}
      <div className="flex items-center gap-3 shrink-0">
        <div className="w-10 h-10 rounded-full overflow-hidden shrink-0">
          <Image
            src="/avatars/testimonial-avatar.jpg"
            alt={testimonio.author}
            width={40}
            height={40}
            className="object-cover w-full h-full"
          />
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
