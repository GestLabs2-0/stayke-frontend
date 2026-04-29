import { AddPropertyFormData } from "@/src/types/AddPropertyFormData";
import { Field } from "../../shared/Field/Field";
import { PROPERTY_TYPES } from "../StepConfig";

// ── Step 1 – Basics ───────────────────────────────────────────────────────────
export const StepBasics = ({
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
    <Field
      label="Property title"
      value={form.title}
      onChange={(v) => onChange("title", v)}
      placeholder="Cozy beachfront apartment"
    />

    {/* Description */}
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-foreground">Description</label>
      <textarea
        value={form.description}
        onChange={(e) => onChange("description", e.target.value)}
        placeholder="Describe your property: highlights, amenities, nearby attractions…"
        rows={4}
        className="rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground shadow-sm focus:border-primary focus:outline-none transition-colors resize-none"
      />
    </div>

    {/* Property type */}
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-foreground">
        Property type
      </label>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {PROPERTY_TYPES.map((type) => (
          <button
            key={type}
            type="button"
            onClick={() => onChange("propertyType", type)}
            className={`rounded-xl border px-3 py-2 text-sm font-medium transition-all cursor-pointer ${
              form.propertyType === type
                ? "border-primary bg-primary/10 text-primary"
                : "border-border bg-background text-muted-foreground hover:border-primary/50 hover:text-foreground"
            }`}
          >
            {type}
          </button>
        ))}
      </div>
    </div>
  </div>
);
