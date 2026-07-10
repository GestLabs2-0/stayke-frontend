import type { LucideProps } from "lucide-react";
import { forwardRef } from "react";

export const IconHouse = forwardRef<SVGSVGElement, LucideProps>(
  ({ size = 25, ...props }, ref) => (
    <svg
      ref={ref}
      width={size}
      height={size}
      aria-label="Icon House"
      role="img"
      viewBox="0 0 22 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M5 18H17V16H5V18ZM5 14H17V12H5V14ZM5 10H17V9.1L15.55 8H6.45L5 9.1V10ZM9.05 6H12.95L11 4.525L9.05 6ZM3 20V10.625L1.2 12L0 10.4L3 8.1V5H5V6.575L11 2L22 10.4L20.8 11.975L19 10.625V20H3ZM3 4C3 3.16667 3.29167 2.45833 3.875 1.875C4.45833 1.29167 5.16667 1 6 1C6.28333 1 6.52083 0.904167 6.7125 0.7125C6.90417 0.520833 7 0.283333 7 0H9C9 0.833333 8.70833"
        fill="#434654"
      />
    </svg>
  ),
);
