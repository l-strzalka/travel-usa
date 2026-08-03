export interface RoutePoint {
  id: number;
  productId: number;
  latitude: number;
  longitude: number;
  stopOrder: number;
  title?: string | null;
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: number;
  breadcrumbs?: string;
  imageUrl?: string;
  location?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  createdAt: string;
  category?: string;
  priceFrom?: number;
  currency?: string;
  durationDays?: number;
  highlights?: string;
  tailorMadeFeatures?: string;
  tripPlan?: string;
  priceExcludes?: number;
  routePoints?: RoutePoint[];
}

export interface UseFeaturedToursOptions {
  limit?: number;
  category?: string; // Do przyszłej rozbudowy
}

// 3. Przetworzony model danych gotowy do renderowania w MUI
export interface FormattedTripStep {
  dayLabel: string;
  title: string;
  description: string[];
}

export interface FormattedPriceDetail {
  title: string;
  description: string;
}

export interface FormattedBreadcrumb {
  label: string;
  href?: string;
}

export interface FormattedPlaceData {
  id: string;
  title: string;
  category: string;
  location: string;
  priceFrom: number;
  currency: string;
  durationDays: number;
  heroImageUrl: string;
  breadcrumbs: FormattedBreadcrumb[];
  description?: string;
  highlights: string[];
  tailorMadeFeatures: string[];
  tripPlan: FormattedTripStep[];
  priceIncludes: FormattedPriceDetail[];
  priceExcludes: FormattedPriceDetail[];
  priceDisclaimer: string;
  latitude?: number | null;
  longitude?: number | null;
  routePoints: RoutePoint[];
}
