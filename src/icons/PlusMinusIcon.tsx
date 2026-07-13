interface PlusMinusIconProps {
  open?: boolean;
  className?: string;
}

export const PlusMinusIcon = ({
  open = false,
  className,
}: PlusMinusIconProps) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    aria-hidden="true"
  >
    <path d="M5 12h14" />
    <path
      d="M12 5v14"
      style={{
        transformOrigin: "12px 12px",
        transition: "transform 300ms ease-in-out, opacity 300ms ease-in-out",
        transform: open ? "scaleY(0)" : "scaleY(1)",
        opacity: open ? 0 : 1,
      }}
    />
  </svg>
);
