/**
 * Builds a FormData instance from a flat object.
 *
 * - `null` / `undefined` values are skipped (so optional fields are omitted).
 * - `File` / `Blob` values are appended as-is.
 * - Everything else is stringified (numbers and booleans included).
 *
 * Used to send `multipart/form-data` payloads to the backend.
 */
export function objectToFormData(data: object): FormData {
  const formData = new FormData();

  for (const [key, value] of Object.entries(data)) {
    if (value === null || value === undefined) continue;

    if (value instanceof File || value instanceof Blob) {
      formData.append(key, value);
      continue;
    }

    formData.append(key, String(value));
  }

  return formData;
}
