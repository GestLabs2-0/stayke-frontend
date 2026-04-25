import { DocumentTypeOption } from "@/src/types/DocumentMenuOption";
import { DocType } from "../generated/stayke_core";

export const DOCUMENT_TYPES: DocumentTypeOption[] = [
  { value: "passport", label: "Passport", icon: "📘" },
  { value: "driving_license", label: "Driver's License", icon: "🚗" },
  { value: "dni", label: "National ID", icon: "🪪" },
];

export const parseDoctype = (doctype: string): DocType => {
  switch (doctype) {
    case "passport":
      return DocType.Passport;
    case "id_card":
      return DocType.IdCard;
    case "driver_license":
      return DocType.DriversLicense;
    default:
      throw new Error(`Unknown doctype: ${doctype}`);
  }
};
