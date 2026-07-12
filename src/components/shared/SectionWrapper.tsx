import type { ReactNode } from "react";

type SectionWrapperProps = {
  children: ReactNode;
  className?: string;
  maxWidth?: string;
};

export const SectionWrapper = ({
  children,
  className = "",
  maxWidth = "max-w-[1200px]",
}: SectionWrapperProps) => {
  return (
    <section
      className={`w-full mx-auto px-[clamp(1.5rem,3.5vw,3rem)] py-12 ${maxWidth} ${className}`}
    >
      {children}
    </section>
  );
};
