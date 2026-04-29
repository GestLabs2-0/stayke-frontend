import { AddPropertyFormData } from "@/src/types/AddPropertyFormData";
import { SectionLabel } from "../shared/SectionLabel";
import { Field } from "../../shared/Field/Field";
import { MapPin } from "lucide-react";

// ── Step 2 – Location ─────────────────────────────────────────────────────────
export const StepLocation = ({
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
    <SectionLabel>Where is your property?</SectionLabel>

    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <Field
        label="Country"
        value={form.country}
        onChange={(v) => onChange("country", v)}
        placeholder="e.g. Mexico"
      />
      <Field
        label="City"
        value={form.city}
        onChange={(v) => onChange("city", v)}
        placeholder="e.g. Cancún"
      />
    </div>

    <Field
      label="Street address"
      value={form.address}
      onChange={(v) => onChange("address", v)}
      placeholder="Blvd. Kukulcán Km 9.5, Zona Hotelera"
    />

    {/* Map placeholder */}
    <div className="flex items-center justify-center rounded-xl border border-dashed border-border bg-muted/20 h-32 gap-2">
      <MapPin className="h-5 w-5 text-muted-foreground" />
      <span className="text-sm text-muted-foreground">
        Interactive map —{" "}
        <span className="text-primary font-medium">coming soon</span>
      </span>
    </div>
  </div>
);
