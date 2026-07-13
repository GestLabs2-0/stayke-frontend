"use client";

import { BlossomCarousel } from "@blossom-carousel/react";
import { SectionWrapper } from "@/components/shared/SectionWrapper";
import { testimoniosData } from "./mocks";
import { TestimonioCard } from "./TestimonioCard";

export const Testimonios = () => {
  // TODO: refactorizar a que use un solo div para gestionar los grids. Se usan las grid areas para eso
  return (
    <SectionWrapper className="max-[700px]:pr-0">
      {/* Desktop: grid */}
      <div className="hidden lg:grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {testimoniosData.map((testimonio) => (
          <TestimonioCard key={testimonio.id} testimonio={testimonio} />
        ))}
      </div>

      {/* Mobile: carousel */}
      <div className="lg:hidden">
        <BlossomCarousel load="conditional">
          {testimoniosData.map((testimonio) => (
            // <span key={testimonio.id} className="inline-block mx-2 first:ml-0">
            <TestimonioCard key={testimonio.id} testimonio={testimonio} />
            // </span>
          ))}
        </BlossomCarousel>
      </div>
    </SectionWrapper>
  );
};
