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
}: FetchExploreProductsParams): Promise<PaginatedExploreProductsResponse> => {
  const response = await axiosInstance.get<
    ExploreProduct[] | PaginatedExploreProductsResponse
  >('/products', {
    params: {
      _page: page,
      _limit: limit,
      page,
      limit,
    },
  });

  // Obsługa odpowiedzi zarówno bezpośredniej tablicy z json-server/API, jak i obiektu z paginacją
  if (Array.isArray(response.data)) {
    const hasMore = response.data.length === limit;
    return {
      data: response.data,
      nextPage: hasMore ? page + 1 : null,
      total: response.data.length,
    };
  }

  return response.data;
};