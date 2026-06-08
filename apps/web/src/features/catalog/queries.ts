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

export function useFacets(query: ProductQuery) {
  return useQuery({
    queryKey: ['facets', query],
    queryFn: () => apiClient.getFacets(query),
  });
}

export function useSuggestions(q: string) {
  return useQuery({
    queryKey: ['suggest', q],
    queryFn: () => apiClient.getSuggestions(q),
    enabled: q.trim().length >= 2,
  });
}

export function useProduct(slug: string) {
  return useQuery({
    queryKey: ['product', slug],
    queryFn: () => apiClient.getProduct(slug),
    enabled: !!slug,
  });
}

export function useRelated(slug: string) {
  return useQuery({
    queryKey: ['related', slug],
    queryFn: () => apiClient.getRelated(slug),
    enabled: !!slug,
  });
}
