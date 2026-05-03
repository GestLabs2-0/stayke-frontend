//Library
import { DollarSign, Home } from "lucide-react";
//Type
import { AddPropertyFormData } from "@/src/types/AddPropertyFormData";
//Own Components
import { STEP_DETAILS_CONFIG } from "../StepConfig";
import { SectionLabel } from "../shared/SectionLabel";

// ── Step 3 – Details & Pricing ────────────────────────────────────────────────
export const StepDetails = ({
  form,
  onChange,
}: {
  form: AddPropertyFormData;
  onChange: <K extends keyof AddPropertyFormData>(
    k: K,
    v: AddPropertyFormData[K]
  ) => void;
}) => (
  <div className="flex flex-col gap-5">
    {/* Pricing */}
    <div>
      <SectionLabel>Pricing</SectionLabel>
      <div className="relative">
        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
        <input
          type="number"
          min="0"
          value={form.pricePerNight}
          onChange={(e) => onChange("pricePerNight", e.target.value)}
          placeholder="0.00"
          className="w-full rounded-md border border-border bg-background pl-9 pr-3 py-2 text-sm text-foreground placeholder:text-muted-foreground shadow-sm focus:border-primary focus:outline-none transition-colors"
        />
      </div>
      <p className="mt-1 text-xs text-muted-foreground">
        Price per night in{" "}
        <span className="text-foreground font-medium">USDC</span>
      </p>
    </div>

    {/* Capacity */}
    <div>
      <SectionLabel>Capacity & rooms</SectionLabel>
      <div className="grid grid-cols-3 gap-3">
        {STEP_DETAILS_CONFIG.map(({ key, label }) => (
          <div key={key} className="flex flex-col gap-2">
            <label className="text-sm font-medium text-foreground">
              {label}
            </label>
            <input
              type="number"
              min="0"
              value={form[key]}
              onChange={(e) => onChange(key, e.target.value)}
              placeholder="0"
              className="rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground shadow-sm focus:border-primary focus:outline-none transition-colors"
            />
          </div>
        ))}
      </div>
    </div>

    {/* On-chain info chip */}
    <div className="flex items-start gap-2 rounded-xl border border-primary/20 bg-primary/5 px-4 py-3">
      <Home className="h-4 w-4 text-primary mt-0.5 shrink-0" />
      <p className="text-xs text-muted-foreground leading-relaxed">
        Property price is stored on-chain in{" "}
        <span className="text-foreground font-medium">USDC (lamports)</span>.
        Make sure you enter the nightly rate you want guests to pay.
      </p>
    </div>
  </div>
);
