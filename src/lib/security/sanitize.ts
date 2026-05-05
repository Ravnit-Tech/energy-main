// Strip HTML tags and dangerous characters from a string
export function sanitizeString(value: string): string {
  return value
    .replace(/<[^>]*>/g, "")           // strip HTML tags
    .replace(/[<>"'`]/g, "")           // strip remaining angle brackets and quotes
    .replace(/javascript:/gi, "")      // strip JS protocol
    .replace(/on\w+\s*=/gi, "")        // strip inline event handlers
    .trim();
}

// Recursively sanitize all string values in an object (for form data)
export function sanitizeFormData<T extends Record<string, unknown>>(data: T): T {
  const result = { ...data };
  for (const key in result) {
    const val = result[key];
    if (typeof val === "string") {
      (result as Record<string, unknown>)[key] = sanitizeString(val);
    } else if (val !== null && typeof val === "object" && !Array.isArray(val)) {
      (result as Record<string, unknown>)[key] = sanitizeFormData(val as Record<string, unknown>);
    }
  }
  return result;
}
