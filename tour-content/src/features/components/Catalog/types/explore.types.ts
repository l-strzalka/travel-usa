export interface ExploreProduct {
  id: string | number;
  name: string;
  slug: string;
  location?: string;
  price: number;
  imageUrl?: string;
  description?: string;
}

export interface PaginatedExploreProductsResponse {
  data: ExploreProduct[];
  nextPage: number | null;
  total: number;
}

export interface FetchExploreProductsParams {
  page?: number;
  limit?: number;
}