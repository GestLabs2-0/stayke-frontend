export const ChevronLeftIcon = ({
  className = "w-5 h-5",
}: {
  className?: string;
}) => (
  <svg
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
    className={className}
    aria-hidden="true"
  >
    <polyline points="15 18 9 12 15 6" />
  </svg>
);
