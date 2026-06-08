import { type Money } from './money';

export interface BrandDto {
  id: string;
  name: string;
  slug: string;
}

export interface CategoryNodeDto {
  id: string;
  name: string;
  slug: string;
  children: CategoryNodeDto[];
}

export interface PriceDto {
  current: Money;
  old: Money | null;
  discountPct: number | null;
  promoStart: string | null;
  promoEnd: string | null;
}

export interface SkuDto {
  id: string;
  size: string;
  stock: number;
  inStock: boolean;
}

export interface VariantDto {
  id: string;
  colorName: string;
  slug: string;
  images: string[];
  skus: SkuDto[];
}

export interface ProductCardDto {
  id: string;
  name: string;
  slug: string;
  brand: string;
  image: string | null;
  price: PriceDto;
  ratingAvg: number;
  reviewCount: number;
}

export interface BreadcrumbDto {
  name: string;
  slug: string;
}

export interface ProductDetailDto {
  id: string;
  name: string;
  slug: string;
  description: string;
  brand: BrandDto;
  category: BreadcrumbDto[];
  price: PriceDto;
  ratingAvg: number;
  reviewCount: number;
  variants: VariantDto[];
}

export type ProductSort = 'newest' | 'price_asc' | 'price_desc' | 'rating';

export interface ProductQuery {
  categorySlug?: string;
  brandSlug?: string;
  page?: number;
  pageSize?: number;
  sort?: ProductSort;
}

export interface Paginated<T> {
  items: T[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}
