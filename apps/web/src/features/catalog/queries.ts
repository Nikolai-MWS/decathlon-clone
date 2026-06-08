import { useQuery } from '@tanstack/react-query';
import { type ProductQuery } from '@decathlon/shared';
import { apiClient } from '../../lib/apiClient';

export function useCategories() {
  return useQuery({ queryKey: ['categories'], queryFn: apiClient.getCategories, staleTime: 60_000 });
}

export function useProducts(query: ProductQuery) {
  return useQuery({
    queryKey: ['products', query],
    queryFn: () => apiClient.getProducts(query),
  });
}

export function useProduct(slug: string) {
  return useQuery({
    queryKey: ['product', slug],
    queryFn: () => apiClient.getProduct(slug),
    enabled: !!slug,
  });
}
