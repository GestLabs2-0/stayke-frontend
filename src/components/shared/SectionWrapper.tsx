import type { ReactNode } from "react";

type SectionWrapperProps = {
  children: ReactNode;
  className?: string;
  maxWidth?: string;
  ariaLabel?: string;
};

export const SectionWrapper = ({
  children,
  ariaLabel = "",
  className = "",
  maxWidth = "max-w-400",
}: SectionWrapperProps) => {
  return (
    <section
      aria-label={ariaLabel}
      className={`w-full mx-auto px-40 max-[1210px]:px-16.5 py-12 ${maxWidth} ${className}`}
    >
      {children}
    </section>
  );
};
