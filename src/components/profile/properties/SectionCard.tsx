import type { SectionCardProps } from "@/types/property/SectionCard";

export function SectionCard({ title, children }: SectionCardProps) {
  return (
    <div className="card-white">
      <div className="mb-4 border-b border-[#c3c6d6] pb-3">
        <h3 className="font-montserrat text-[15px] font-bold text-[#171717]">
          {title}
        </h3>
      </div>
      <div className="space-y-4">{children}</div>
    </div>
  );
}
