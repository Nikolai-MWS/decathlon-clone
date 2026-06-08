import {
  type BrandDto,
  type CategoryNodeDto,
  type FacetsDto,
  type HealthStatus,
  type Paginated,
  type ProductCardDto,
  type ProductDetailDto,
  type ProductQuery,
  type SuggestionDto,
} from '@decathlon/shared';

const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api';

async function getJson<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, { credentials: 'include' });
  if (!res.ok) throw new Error(`Request failed: ${res.status}`);
  return (await res.json()) as T;
}

function productsQueryString(query: ProductQuery): string {
  const params = new URLSearchParams();
  if (query.categorySlug) params.set('categorySlug', query.categorySlug);
  if (query.brandSlugs) params.set('brandSlugs', query.brandSlugs);
  if (query.q) params.set('q', query.q);
  if (query.minPriceEur !== undefined) params.set('minPriceEur', String(query.minPriceEur));
  if (query.maxPriceEur !== undefined) params.set('maxPriceEur', String(query.maxPriceEur));
  if (query.minRating !== undefined) params.set('minRating', String(query.minRating));
  if (query.onSale) params.set('onSale', 'true');
  if (query.page) params.set('page', String(query.page));
  if (query.pageSize) params.set('pageSize', String(query.pageSize));
  if (query.sort) params.set('sort', query.sort);
  const qs = params.toString();
  return qs ? `?${qs}` : '';
}

export const apiClient = {
  getHealth: () => getJson<HealthStatus>('/health'),
  getCategories: () => getJson<CategoryNodeDto[]>('/categories'),
  getBrands: () => getJson<BrandDto[]>('/brands'),
  getProducts: (query: ProductQuery = {}) =>
    getJson<Paginated<ProductCardDto>>(`/products${productsQueryString(query)}`),
  getFacets: (query: ProductQuery = {}) =>
    getJson<FacetsDto>(`/facets${productsQueryString(query)}`),
  getSuggestions: (q: string) =>
    getJson<SuggestionDto[]>(`/products/suggest?q=${encodeURIComponent(q)}`),
  getProduct: (slug: string) => getJson<ProductDetailDto>(`/products/${slug}`),
};
