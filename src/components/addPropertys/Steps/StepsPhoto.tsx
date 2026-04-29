//library
import { Upload } from "lucide-react";
//Type
import { AddPropertyFormData } from "@/src/types/AddPropertyFormData";
//Own Components
import { SectionLabel } from "../shared/SectionLabel";
//Next
import Image from "next/image";

// ── Step 4 – Photos ───────────────────────────────────────────────────────────
export const StepPhotos = ({
  form,
  onChange,
}: {
  form: AddPropertyFormData;
  onChange: <K extends keyof AddPropertyFormData>(
    k: K,
    v: AddPropertyFormData[K]
  ) => void;
}) => {
  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => onChange("image", reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex flex-col gap-5">
      <SectionLabel>Main photo</SectionLabel>

      <label className="relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border bg-muted/20 h-52 cursor-pointer overflow-hidden hover:border-primary transition-colors group">
        {form.image ? (
          <Image
            src={form.image}
            alt="Property preview"
            fill
            className="object-cover"
            unoptimized
          />
        ) : (
          <div className="flex flex-col items-center gap-3 text-muted-foreground group-hover:text-primary transition-colors">
            <Upload className="h-10 w-10" />
            <p className="text-sm font-medium">Click to upload cover photo</p>
            <p className="text-xs">PNG, JPG, WEBP — max 10MB</p>
          </div>
        )}
        <input
          type="file"
          accept="image/*"
          onChange={handleFile}
          className="hidden"
        />
      </label>

      {form.image && (
        <button
          type="button"
          onClick={() => onChange("image", "")}
          className="self-start text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
        >
          Remove photo
        </button>
      )}

      <p className="text-xs text-muted-foreground leading-relaxed">
        A great cover photo can increase bookings by up to{" "}
        <span className="text-primary font-medium">40 %</span>. Use a
        high-quality, well-lit photo of the main area.
      </p>
    </div>
  );
};
