// \tour-content\src\features\components\Catalog\types\explore.types.ts

export interface ExploreProduct {
  id: number;
  name: string;
  slug: string;
  description?: string;
  price: number;
  imageUrl?: string;
  location?: string;
}

export interface ExploreFilters {
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  location?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedExploreProductsResponse {
  data: ExploreProduct[];
  nextPage: number | null;
  total: number;
}

export interface FetchExploreProductsParams extends ExploreFilters {
  page?: number;
  limit?: number;
}