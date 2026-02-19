const SITE_URL = "https://foundersksa.com";

/**
 * Returns a clean shareable URL using the foundersksa.com domain.
 */
export function getShareUrl(path: string): string {
  return `${SITE_URL}${path}`;
}
