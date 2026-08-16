import { keepPreviousData, useInfiniteQuery } from '@tanstack/react-query';
import { fetchExploreProducts } from '../components/Catalog/services/exploreServices';
import { ExploreFilters, PaginatedExploreProductsResponse } from '../components/Catalog/types/explore.types';

interface UseInfiniteExploreToursOptions {
  limit?: number;
  filters?: ExploreFilters;
}

export const useInfiniteExploreTours = ({
  limit = 8,
  filters = {},
}: UseInfiniteExploreToursOptions = {}) => {
  return useInfiniteQuery<PaginatedExploreProductsResponse, Error>({
    queryKey: ['exploreTours', 'infinite', limit, filters],
    queryFn: ({ pageParam = 1 }) =>
      fetchExploreProducts({
        page: pageParam as number,
        limit,
        ...filters,
      }),
    initialPageParam: 1,
    placeholderData: keepPreviousData,
    getNextPageParam: (lastPage) => lastPage.nextPage ?? undefined,
    staleTime: 1000 * 60 * 5,
  });
};