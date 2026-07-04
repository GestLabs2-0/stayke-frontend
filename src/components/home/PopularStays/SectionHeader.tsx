import type { ReactNode } from "react";

type SectionHeaderProps = {
  title: string;
  children?: ReactNode;
};

export const SectionHeader = ({ title, children }: SectionHeaderProps) => (
  <div className="flex items-center justify-between gap-4 mt-6">
    <h2 className="text-3xl font-semibold text-zinc-900 tracking-tight">
      {title}
    </h2>
    {children && (
      <div className="flex items-center gap-2 shrink-0">{children}</div>
    )}
  </div>
);
