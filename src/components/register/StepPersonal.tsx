"use client";
import { Upload } from "lucide-react";
import { useState } from "react";
import Image from "next/image";
import { Field } from "../shared/Field/Field";
import { CountrySelector } from "../shared/Field/CountrySelector";
import type { SelectMenuOption } from "@/src/types/SelectMenuOption";
import type { RegisterFormData } from "@/src/types/RegisterFormData";

interface Props {
  form: RegisterFormData;
  onChange: (field: keyof RegisterFormData, value: string) => void;
}
import { COUNTRIES } from "../ui/COUNTRIES";
import { DOCUMENT_TYPES } from "../ui/DOCUMENT_TYPES";
import { DocumentTypeSelector } from "../shared/Field/DocumentSelector";

export const StepPersonal = ({ form, onChange }: Props) => {
  const [countryOpen, setCountryOpen] = useState<boolean>(false);
  const [docTypeOpen, setDocTypeOpen] = useState<boolean>(false);

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => onChange("image", reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const selectedCountry =
    COUNTRIES.find((c) => c.value === form.country) ??
    ({
      value: "",
      title: "Select nationality",
      label: "🌍",
    } as SelectMenuOption);

  const selectedDocType =
    DOCUMENT_TYPES.find((d) => d.value === form.documentType) ?? null;

  return (
    <div className="flex flex-col gap-5">
      {/* Foto de perfil */}
      <div className="flex flex-col items-center gap-3">
        <label className="relative h-24 w-24 rounded-full border-2 border-dashed border-border bg-muted/30 flex items-center justify-center overflow-hidden cursor-pointer hover:border-primary transition-colors">
          {form.image ? (
            <Image
              src={form.image}
              alt="Profile Preview"
              fill
              className="object-cover"
              unoptimized
            />
          ) : (
            <Upload className="h-8 w-8 text-muted-foreground" />
          )}
          <input
            type="file"
            accept="image/*"
            onChange={handleImage}
            className="hidden"
          />
        </label>
        <p className="text-xs text-muted-foreground">
          Click to upload or drag profile picture
        </p>
      </div>

      {/* Nombre */}
      <div className="grid grid-cols-1 gap-4 ">
        <Field
          label="First Name"
          value={form.firstName}
          onChange={(v) => onChange("firstName", v)}
          placeholder="John"
        />
        <Field
          label="Last Name"
          value={form.lastName}
          onChange={(v) => onChange("lastName", v)}
          placeholder="Doe"
        />
      </div>

      {/* Identidad */}
      <div className="flex flex-col gap-3">
        <span className="text-md font-medium leading-none pb-1">Identity</span>

        {/* Nacionalidad — CountrySelector estilo driaug */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs text-muted-foreground">Nationality</label>
          <CountrySelector
            id="nationality"
            open={countryOpen}
            onToggle={() => setCountryOpen((prev) => !prev)}
            onChange={(val) => onChange("country", val)}
            selectedValue={selectedCountry}
          />
        </div>

        {/* Tipo de documento + Número */}
        <div className="grid grid-cols-1 gap-3">
          <div className="flex flex-col gap-1.5">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-muted-foreground">
                Document Type
              </label>
              <DocumentTypeSelector
                id="document-type"
                open={docTypeOpen}
                onToggle={() => setDocTypeOpen((p) => !p)}
                onChange={(val) => onChange("documentType", val)}
                selectedValue={selectedDocType}
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-muted-foreground">
              Document Number
            </label>
            <input
              type="text"
              value={form.documentNumber}
              onChange={(e) =>
                onChange("documentNumber", e.target.value.toUpperCase())
              }
              placeholder="e.g. AB123456"
              className="w-full rounded-md border bg-background px-3 py-2 text-sm text-foreground shadow-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none "
            />
          </div>
        </div>
      </div>
    </div>
  );
};
