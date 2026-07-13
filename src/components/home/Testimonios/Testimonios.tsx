"use client";

import { BlossomCarousel } from "@blossom-carousel/react";
import { SectionWrapper } from "@/components/shared/SectionWrapper";
import { testimoniosData } from "./mocks";
import { TestimonioCard } from "./TestimonioCard";

export const Testimonios = () => {
  return (
    <SectionWrapper>
      {/* Desktop: grid */}
      <div className="hidden min-[700px]:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
        {testimoniosData.map((testimonio) => (
          <TestimonioCard key={testimonio.id} testimonio={testimonio} />
        ))}
      </div>

      {/* Mobile: carousel */}
      <div className="min-[700px]:hidden">
        <BlossomCarousel load="conditional">
          {testimoniosData.map((testimonio) => (
            <span key={testimonio.id} className="inline-block mx-2 first:ml-0">
              <TestimonioCard testimonio={testimonio} />
            </span>
          ))}
        </BlossomCarousel>
      </div>
    </SectionWrapper>
  );
};
