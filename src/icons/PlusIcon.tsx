import type { SVGProps } from "react";

export const PlusIcon = ({
  className = "w-4 h-4",
  ...props
}: SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    className={className}
    aria-hidden="true"
    {...props}
  >
    <path d="M12 5v14M5 12h14" />
  </svg>
);
