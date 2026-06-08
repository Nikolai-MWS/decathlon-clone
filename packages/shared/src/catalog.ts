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

export type AttributeSection = 'advantages' | 'specs' | 'care' | 'environment';

export interface ProductAttributeDto {
  section: AttributeSection;
  /** Key for spec rows; empty for bullet-style advantages. */
  label: string;
  value: string;
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
  attributes: ProductAttributeDto[];
}

export type ProductSort = 'newest' | 'price_asc' | 'price_desc' | 'rating';

export interface ProductQuery {
  categorySlug?: string;
  /** @deprecated use brandSlugs */
  brandSlug?: string;
  /** Comma-separated brand slugs for multi-select faceting. */
  brandSlugs?: string;
  /** Free-text search across product name + description. */
  q?: string;
  /** Minimum current price in euros (inclusive). */
  minPriceEur?: number;
  /** Maximum current price in euros (inclusive). */
  maxPriceEur?: number;
  /** Minimum average rating (0–5). */
  minRating?: number;
  /** Only products currently discounted. */
  onSale?: boolean;
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

export interface BrandFacet {
  slug: string;
  name: string;
  count: number;
}

export interface FacetsDto {
  brands: BrandFacet[];
  /** Price range across the matched set, in euro cents. */
  priceMinEur: number;
  priceMaxEur: number;
  total: number;
}

export interface SuggestionDto {
  name: string;
  slug: string;
  image: string | null;
}
