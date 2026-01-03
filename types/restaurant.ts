export interface Restaurant {
  id: string;
  name: string;
  address: string;
  cuisine: string;
  rating: number;
  priceRange: string;
  openingHours: string;
  closingHours: string;
  operatingHoursDetailed?: string; // Day-specific hours from CSV
  latitude: number;
  longitude: number;
  phone: string;
  description: string;
}

export interface SearchParams {
  latitude?: number;
  longitude?: number;
  address?: string;
}

export interface ApiResponse {
  restaurants: Restaurant[];
  message?: string;
  error?: string;
}
