import {
  type BreadcrumbDto,
  type CategoryNodeDto,
  type PriceDto,
  type ProductCardDto,
  type ProductDetailDto,
  eurCentsToMoney,
} from '@decathlon/shared';
import { Category } from './entities/category.entity';
import { Price } from './entities/price.entity';
import { Product } from './entities/product.entity';

export function toPriceDto(price: Price): PriceDto {
  return {
    current: eurCentsToMoney(price.currentEur),
    old: price.oldEur != null ? eurCentsToMoney(price.oldEur) : null,
    discountPct: price.discountPct,
    promoStart: price.promoStart ? price.promoStart.toISOString() : null,
    promoEnd: price.promoEnd ? price.promoEnd.toISOString() : null,
  };
}

function firstImage(product: Product): string | null {
  const variant = product.variants?.[0];
  if (!variant?.images?.length) return null;
  const sorted = [...variant.images].sort((a, b) => a.position - b.position);
  return sorted[0]?.url ?? null;
}

export function toProductCard(product: Product): ProductCardDto {
  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    brand: product.brand?.name ?? '',
    image: firstImage(product),
    price: toPriceDto(product.price),
    ratingAvg: Number(product.ratingAvg),
    reviewCount: product.reviewCount,
  };
}

export function toProductDetail(product: Product, breadcrumb: BreadcrumbDto[]): ProductDetailDto {
  const variants = [...(product.variants ?? [])].map((variant) => ({
    id: variant.id,
    colorName: variant.colorName,
    slug: variant.slug,
    images: [...(variant.images ?? [])]
      .sort((a, b) => a.position - b.position)
      .map((image) => image.url),
    skus: [...(variant.skus ?? [])].map((sku) => ({
      id: sku.id,
      size: sku.size,
      stock: sku.stock,
      inStock: sku.stock > 0,
    })),
  }));

  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    description: product.description,
    brand: { id: product.brand.id, name: product.brand.name, slug: product.brand.slug },
    category: breadcrumb,
    price: toPriceDto(product.price),
    ratingAvg: Number(product.ratingAvg),
    reviewCount: product.reviewCount,
    variants,
  };
}

export function buildCategoryTree(categories: Category[]): CategoryNodeDto[] {
  const nodes = new Map<string, CategoryNodeDto>();
  for (const c of categories) {
    nodes.set(c.id, { id: c.id, name: c.name, slug: c.slug, children: [] });
  }
  const roots: CategoryNodeDto[] = [];
  for (const c of categories) {
    const node = nodes.get(c.id)!;
    if (c.parentId && nodes.has(c.parentId)) {
      nodes.get(c.parentId)!.children.push(node);
    } else {
      roots.push(node);
    }
  }
  return roots;
}
