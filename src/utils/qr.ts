/**
 * Build the absolute QR-menu URL for a restaurant + table using the
 * *current* application origin — never a hardcoded host.
 *
 * Works identically on localhost, a staging box, or a real domain.
 *
 *   getQRMenuUrl('demo-restaurant', 'table-12')
 *   → "http://localhost:5173/qr/demo-restaurant/table-12"
 *   → "https://yourrestaurant.com/qr/demo-restaurant/table-12"   (in prod)
 */
export function getQRMenuUrl(restaurantId: string, tableId: string): string {
  const origin =
    typeof window !== 'undefined' && window.location?.origin
      ? window.location.origin
      : ''
  return `${origin}/qr/${encodeURIComponent(restaurantId)}/${encodeURIComponent(tableId)}`
}

/** Convenience: current page URL (used for "share" style actions). */
export function getCurrentUrl(): string {
  return typeof window !== 'undefined' ? window.location.href : ''
}
