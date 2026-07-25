"use client";

import type { SectionCardProps } from "@/types/profile";

export function SectionCard({
  icon,
  title,
  headingLevel = "h2",
  rightContent,
  children,
}: SectionCardProps) {
  const Heading = headingLevel;

  return (
    <section className="card-white">
      <div className="mb-4 flex items-center gap-2">
        {icon}
        <Heading className="font-montserrat text-base font-bold text-[#171717]">
          {title}
        </Heading>
        {rightContent && <div className="ml-auto">{rightContent}</div>}
      </div>
      {children}
    </section>
  );
}
