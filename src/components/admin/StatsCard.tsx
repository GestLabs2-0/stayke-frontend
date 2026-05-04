//Types
import { StatsCardProps } from "@/src/types/Admin";

export const StatsCard = ({ label, value, sub, accent }: StatsCardProps) => (
  <div
    className={`rounded-xl border p-5 flex flex-col gap-1 transition-shadow hover:shadow-glow
      ${accent ? "border-primary/30 bg-primary/5" : "border-border-low bg-card"}`}
  >
    <p className="text-xs text-muted-foreground uppercase tracking-wider">
      {label}
    </p>
    <p
      className={`text-3xl font-bold ${accent ? "text-gradient" : "text-foreground"}`}
    >
      {value}
    </p>
    {sub && <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>}
  </div>
);
