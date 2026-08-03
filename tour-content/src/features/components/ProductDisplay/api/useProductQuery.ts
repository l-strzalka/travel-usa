import { API_URL } from '@/config';
import { Product } from '../types/products-types';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';

// Funkcja pobierająca pojedynczą wycieczkę/produkt z REST API NestJS

export const fetchProductById = async (id: string): Promise<Product> => {
  const token = localStorage.getItem('auth_token');
  const response = await axios.get<Product>(`${API_URL}/products/${id}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  return response.data;
};

// 2. Pobieranie danych z wykorzystaniem TanStack Query v5+ / React 19
 export const useProductQuery = (slug?: string) => {
  return useQuery<Product>({
    queryKey: ['product', slug],
    queryFn: () => {
      if (!slug) throw new Error('Slug is required');
      return fetchProductById(slug);
    },
    enabled: !!slug,
    retry: 1,
    staleTime: 1000 * 60 * 5,
  });
};
