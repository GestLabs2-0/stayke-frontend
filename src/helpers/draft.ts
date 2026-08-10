import type { CreatePropertyFormValues } from "@/types/property/createProperty";
import { CREATE_PROPERTY_INITIAL_VALUES } from "@/types/property/createProperty";

export function serializeDraft(values: CreatePropertyFormValues): string {
  return JSON.stringify({ ...values, images: [] });
}

export function parseDraft(raw: string): CreatePropertyFormValues | null {
  try {
    const parsed = JSON.parse(raw);
    return { ...CREATE_PROPERTY_INITIAL_VALUES, ...parsed, images: [] };
  } catch {
    return null;
  }
}
