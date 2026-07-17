import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { API_URL } from '../../config';
import { Product, UseFeaturedToursOptions } from '../components/ProductDisplay/types/products-types';

export const useFeaturedTours = (options: UseFeaturedToursOptions = {}) => {
  const limit = options.limit ?? 4;

  return useQuery<Product[]>({
    queryKey: ['featuredTours', limit],
    queryFn: async () => {
      // Pobieramy oferty bezpośrednio z API z limitem
      
      const response = await axios.get<Product[]>(`${API_URL}/products`, {
        params: {
          _limit: limit, // Lub odpowiednik paginacji/limitu w NestJS
          _sort: 'createdAt',
          _order: 'desc',
        },
      });
      
      // Zwracamy dokładnie tyle ile potrzebujemy do siatki 2x2
      return response.data.slice(0, limit);
    },
    staleTime: 1000 * 60 * 10, // 10 minut cache'u
    gcTime: 1000 * 60 * 15,
    retry: 1,
  });
};