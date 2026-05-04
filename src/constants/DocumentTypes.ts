import { DocumentTypeOption } from "@/src/types/DocumentMenuOption";
import { DocType } from "../generated/stayke_core";

export const DOCUMENT_TYPES: DocumentTypeOption[] = [
  { value: "Passport", label: "Passport", icon: "📘" },
  { value: "DriversLicense", label: "Driver's License", icon: "🚗" },
  { value: "IdCard", label: "National ID", icon: "🪪" },
];

export const parseDoctype = (doctype: string): DocType => {
  switch (doctype) {
    case "Passport":
      return DocType.Passport;
    case "IdCard":
      return DocType.IdCard;
    case "DriversLicense":
      return DocType.DriversLicense;
    default:
      throw new Error(`Unknown doctype: ${doctype}`);
  }
};
