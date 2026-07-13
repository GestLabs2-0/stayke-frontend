import type { SectionHeaderProps } from "@/types/SliderTypes";

export const SectionHeader = ({ title, children }: SectionHeaderProps) => (
  <header className="flex items-center justify-between gap-4 mt-6">
    <h2 className="text-3xl font-semibold text-zinc-900 tracking-tight">
      {title}
    </h2>
    {children && (
      <nav
        aria-label="Navegación del carrusel"
        className="flex items-center gap-2 shrink-0"
      >
        {children}
      </nav>
    )}
  </header>
);
