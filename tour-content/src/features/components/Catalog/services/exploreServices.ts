// tour-content\src\features\components\Catalog\services\exploreServices.ts

import axios from 'axios';
import { API_URL } from '@/config';
import {
  ExploreProduct,
  PaginatedExploreProductsResponse,
  FetchExploreProductsParams,
} from '../types/explore.types';

const axiosInstance = axios.create({
  baseURL: API_URL,
});

export const fetchExploreProducts = async ({
  page = 1,
  limit = 8,
  search,
  minPrice,
  maxPrice,
  location,
  sortBy,
  sortOrder,
}: FetchExploreProductsParams): Promise<PaginatedExploreProductsResponse> => {
  const _start = (page - 1) * limit;
  const _end = page * limit;

  const response = await axiosInstance.get<
    ExploreProduct[] | PaginatedExploreProductsResponse
  >('/products', {
    params: {
      _start,
      _end,
      _sort: sortBy,
      _order: sortOrder,
      search: search || undefined,
      minPrice: minPrice !== undefined ? minPrice : undefined,
      maxPrice: maxPrice !== undefined ? maxPrice : undefined,
      location: location || undefined,
    },
  });

  const totalCountHeader = response.headers['x-total-count'];
  const total = totalCountHeader ? parseInt(totalCountHeader, 10) : response.data.length;
  const hasMore = _end < total;
  
  // Obsługa odpowiedzi zarówno bezpośredniej tablicy z json-server/API, jak i obiektu z paginacją
  if (Array.isArray(response.data)) {
    const hasMore = response.data.length === limit;
    return {
      data: response.data,
      nextPage: hasMore ? page + 1 : null,
      total: response.data.length,
    };
  }

  return {
    data: response.data.data,
    nextPage: hasMore ? page + 1 : null,
    total,
  };
};