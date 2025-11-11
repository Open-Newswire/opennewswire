/**
 * Validates that a redirect URL is safe to use.
 * Only allows internal paths that start with "/" to prevent open redirect vulnerabilities.
 *
 * @param url The URL to validate
 * @returns The validated URL if safe, null if unsafe
 */
export function validateRedirectUrl(
  url: string | null | undefined,
): string | null {
  if (!url) {
    return null;
  }

  // Remove any leading/trailing whitespace
  const trimmedUrl = url.trim();

  // Must start with "/" to be an internal path
  if (!trimmedUrl.startsWith("/")) {
    return null;
  }

  // Prevent protocol-relative URLs (//example.com)
  if (trimmedUrl.startsWith("//")) {
    return null;
  }

  // Prevent javascript: or data: schemes
  if (trimmedUrl.toLowerCase().includes(":")) {
    return null;
  }

  // Basic length check to prevent extremely long URLs
  if (trimmedUrl.length > 2000) {
    return null;
  }

  return trimmedUrl;
}

/**
 * Gets a safe redirect URL, falling back to a default if the provided URL is invalid.
 *
 * @param url The URL to validate
 * @param fallback The fallback URL to use if validation fails (default: "/admin")
 * @returns A safe redirect URL
 */
export function getSafeRedirectUrl(
  url: string | null | undefined,
  fallback: string = "/admin",
): string {
  const validatedUrl = validateRedirectUrl(url);
  return validatedUrl || fallback;
}
