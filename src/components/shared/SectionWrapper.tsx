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
      className={`w-full mx-auto min-[1210px]:px-40 px-12 pb-4 sm:pb-6 pt-3 ${maxWidth} ${className}`}
    >
      {children}
    </section>
  );
};
