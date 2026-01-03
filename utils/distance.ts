/**
 * Distance calculation utilities
 * Uses the Haversine formula to calculate distance between two points
 */

// Earth's radius in kilometers
const EARTH_RADIUS_KM = 6371;

/**
 * Convert degrees to radians
 */
function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

/**
 * Calculate the distance between two coordinates using the Haversine formula
 * @param lat1 Latitude of point 1
 * @param lon1 Longitude of point 1
 * @param lat2 Latitude of point 2
 * @param lon2 Longitude of point 2
 * @returns Distance in kilometers
 */
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return EARTH_RADIUS_KM * c;
}

/**
 * Format distance for display
 * @param distanceKm Distance in kilometers
 * @returns Formatted distance string
 */
export function formatDistance(distanceKm: number): string {
  if (distanceKm < 1) {
    return `${Math.round(distanceKm * 1000)}m`;
  }
  return `${distanceKm.toFixed(1)} km`;
}

// Default coordinates for Houston (used when no location is provided)
export const DEFAULT_COORDINATES = {
  latitude: 29.7604,
  longitude: -95.3698,
};

/**
 * Simple geocoding mock - in production, use a real geocoding API
 * This provides approximate coordinates for common search terms
 */
export function mockGeocode(address: string): { latitude: number; longitude: number } | null {
  const addressLower = address.toLowerCase();

  // Simple keyword matching for demo purposes
  const locationMap: Record<string, { latitude: number; longitude: number }> = {
    'houston': { latitude: 29.7604, longitude: -95.3698 },
    'downtown': { latitude: 29.7604, longitude: -95.3698 },
    'downtown houston': { latitude: 29.7604, longitude: -95.3698 },
    'galleria': { latitude: 29.7384, longitude: -95.4624 },
    'memorial': { latitude: 29.7752, longitude: -95.5591 },
    'heights': { latitude: 29.8027, longitude: -95.4108 },
    'montrose': { latitude: 29.7425, longitude: -95.3960 },
    'midtown': { latitude: 29.7424, longitude: -95.3687 },
    'rice village': { latitude: 29.7173, longitude: -95.4200 },
    'medical center': { latitude: 29.7072, longitude: -95.4020 },
    'energy corridor': { latitude: 29.7752, longitude: -95.6391 },
    'hillcroft': { latitude: 29.7123, longitude: -95.4954 },
    'westheimer': { latitude: 29.7370, longitude: -95.5195 },
    '77002': { latitude: 29.7589, longitude: -95.3677 },
    '77006': { latitude: 29.7425, longitude: -95.3960 },
    '77019': { latitude: 29.7504, longitude: -95.4022 },
    '77027': { latitude: 29.7476, longitude: -95.4376 },
    '77036': { latitude: 29.7018, longitude: -95.5418 },
    '77057': { latitude: 29.7342, longitude: -95.4623 },
    '77063': { latitude: 29.7342, longitude: -95.5212 },
    '77074': { latitude: 29.6785, longitude: -95.5090 },
    '77081': { latitude: 29.6912, longitude: -95.5034 },
    '77098': { latitude: 29.7345, longitude: -95.4177 },
    '77099': { latitude: 29.6589, longitude: -95.5812 },
  };

  // Check for exact matches first
  for (const [key, coords] of Object.entries(locationMap)) {
    if (addressLower.includes(key)) {
      return coords;
    }
  }

  // Default to Houston city center if no match
  return DEFAULT_COORDINATES;
}
