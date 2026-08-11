import { useInfiniteQuery } from '@tanstack/react-query';
import { fetchExploreProducts } from '../components/Catalog/services/exploreServices';
import { PaginatedExploreProductsResponse } from '../components/Catalog/types/explore.types';

interface UseInfiniteExploreToursOptions {
  limit?: number;
}

export const useInfiniteExploreTours = ({
  limit = 8,
}: UseInfiniteExploreToursOptions = {}) => {
  return useInfiniteQuery<PaginatedExploreProductsResponse, Error>({
    queryKey: ['exploreTours', 'infinite', { limit }],
    queryFn: ({ pageParam = 1 }) =>
      fetchExploreProducts({
        page: pageParam as number,
        limit,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.nextPage ?? undefined,
    staleTime: 1000 * 60 * 5, // 5 minut
  });
};