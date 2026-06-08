import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import {
  type BrandDto,
  type BreadcrumbDto,
  type CategoryNodeDto,
  type FacetsDto,
  type Paginated,
  type ProductCardDto,
  type ProductDetailDto,
  type SuggestionDto,
} from '@decathlon/shared';
import { Brand } from './entities/brand.entity';
import { Category } from './entities/category.entity';
import { Product } from './entities/product.entity';
import { ProductsQueryDto } from './dto/products-query.dto';
import { buildCategoryTree, toProductCard, toProductDetail } from './catalog.mapper';

const SORT_COLUMNS: Record<string, [string, 'ASC' | 'DESC']> = {
  newest: ['product.createdAt', 'DESC'],
  price_asc: ['price.currentEur', 'ASC'],
  price_desc: ['price.currentEur', 'DESC'],
  rating: ['product.ratingAvg', 'DESC'],
};

interface FilterOptions {
  includeBrand?: boolean;
  includePrice?: boolean;
}

@Injectable()
export class CatalogService {
  constructor(
    @InjectRepository(Category) private readonly categories: Repository<Category>,
    @InjectRepository(Brand) private readonly brands: Repository<Brand>,
    @InjectRepository(Product) private readonly products: Repository<Product>,
  ) {}

  async getCategoryTree(): Promise<CategoryNodeDto[]> {
    const all = await this.categories.find({ order: { position: 'ASC', name: 'ASC' } });
    return buildCategoryTree(all);
  }

  async getBrands(): Promise<BrandDto[]> {
    const brands = await this.brands.find({ order: { name: 'ASC' } });
    return brands.map((b) => ({ id: b.id, name: b.name, slug: b.slug }));
  }

  private brandSlugList(query: ProductsQueryDto): string[] {
    const raw = query.brandSlugs ?? query.brandSlug ?? '';
    return raw
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
  }

  /** Applies catalog filters shared by listing, search, and facet queries. */
  private applyFilters(
    qb: SelectQueryBuilder<Product>,
    query: ProductsQueryDto,
    { includeBrand = true, includePrice = true }: FilterOptions = {},
  ): void {
    if (query.categorySlug) {
      qb.andWhere('category.slug = :categorySlug', { categorySlug: query.categorySlug });
    }
    if (query.q) {
      qb.andWhere('(product.name ILIKE :q OR product.description ILIKE :q)', {
        q: `%${query.q}%`,
      });
    }
    const brandSlugs = this.brandSlugList(query);
    if (includeBrand && brandSlugs.length > 0) {
      qb.andWhere('brand.slug IN (:...brandSlugs)', { brandSlugs });
    }
    if (includePrice && query.minPriceEur !== undefined) {
      qb.andWhere('price.currentEur >= :minPrice', { minPrice: Math.round(query.minPriceEur * 100) });
    }
    if (includePrice && query.maxPriceEur !== undefined) {
      qb.andWhere('price.currentEur <= :maxPrice', { maxPrice: Math.round(query.maxPriceEur * 100) });
    }
    if (query.minRating !== undefined) {
      qb.andWhere('product.ratingAvg >= :minRating', { minRating: query.minRating });
    }
    if (query.onSale) {
      qb.andWhere('price.oldEur IS NOT NULL');
    }
  }

  async findProducts(query: ProductsQueryDto): Promise<Paginated<ProductCardDto>> {
    const page = query.page ?? 1;
    const pageSize = query.pageSize ?? 24;
    const [column, direction] = SORT_COLUMNS[query.sort ?? 'newest'];

    const qb = this.products
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.brand', 'brand')
      .leftJoinAndSelect('product.price', 'price')
      .leftJoinAndSelect('product.variants', 'variant')
      .leftJoinAndSelect('variant.images', 'image')
      .leftJoin('product.category', 'category')
      .orderBy(column, direction)
      .addOrderBy('image.position', 'ASC')
      .skip((page - 1) * pageSize)
      .take(pageSize);

    this.applyFilters(qb, query);

    const [items, total] = await qb.getManyAndCount();
    return {
      items: items.map(toProductCard),
      page,
      pageSize,
      total,
      totalPages: Math.max(1, Math.ceil(total / pageSize)),
    };
  }

  /** Facet metadata for the current query: brand counts (ignoring the brand
   * filter so multi-select stays usable) and the price range. */
  async getFacets(query: ProductsQueryDto): Promise<FacetsDto> {
    const brandQb = this.products
      .createQueryBuilder('product')
      .leftJoin('product.brand', 'brand')
      .leftJoin('product.price', 'price')
      .leftJoin('product.category', 'category')
      .select('brand.slug', 'slug')
      .addSelect('brand.name', 'name')
      .addSelect('COUNT(product.id)', 'count')
      .groupBy('brand.slug')
      .addGroupBy('brand.name')
      .orderBy('brand.name', 'ASC');
    this.applyFilters(brandQb, query, { includeBrand: false });
    const brandRows = await brandQb.getRawMany<{ slug: string; name: string; count: string }>();

    const priceQb = this.products
      .createQueryBuilder('product')
      .leftJoin('product.brand', 'brand')
      .leftJoin('product.price', 'price')
      .leftJoin('product.category', 'category')
      .select('MIN(price.currentEur)', 'min')
      .addSelect('MAX(price.currentEur)', 'max')
      .addSelect('COUNT(product.id)', 'count');
    this.applyFilters(priceQb, query, { includePrice: false });
    const priceRow = await priceQb.getRawOne<{ min: string | null; max: string | null; count: string }>();

    return {
      brands: brandRows.map((r) => ({ slug: r.slug, name: r.name, count: Number(r.count) })),
      priceMinEur: priceRow?.min ? Number(priceRow.min) : 0,
      priceMaxEur: priceRow?.max ? Number(priceRow.max) : 0,
      total: priceRow?.count ? Number(priceRow.count) : 0,
    };
  }

  async suggest(q: string, limit = 6): Promise<SuggestionDto[]> {
    if (!q.trim()) return [];
    const products = await this.products
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.variants', 'variant')
      .leftJoinAndSelect('variant.images', 'image')
      .where('product.name ILIKE :q', { q: `%${q}%` })
      .orderBy('product.ratingAvg', 'DESC')
      .take(limit)
      .getMany();

    return products.map((p) => ({
      name: p.name,
      slug: p.slug,
      image: p.variants?.[0]?.images?.[0]?.url ?? null,
    }));
  }

  async getProductBySlug(slug: string): Promise<ProductDetailDto> {
    const product = await this.products.findOne({
      where: { slug },
      relations: {
        brand: true,
        category: true,
        price: true,
        variants: { images: true, skus: true },
        attributes: true,
      },
    });
    if (!product) {
      throw new NotFoundException(`Product not found: ${slug}`);
    }
    const breadcrumb = await this.buildBreadcrumb(product.categoryId);
    return toProductDetail(product, breadcrumb);
  }

  private async buildBreadcrumb(categoryId: string): Promise<BreadcrumbDto[]> {
    const chain: BreadcrumbDto[] = [];
    let current = await this.categories.findOne({ where: { id: categoryId } });
    while (current) {
      chain.unshift({ name: current.name, slug: current.slug });
      current = current.parentId
        ? await this.categories.findOne({ where: { id: current.parentId } })
        : null;
    }
    return chain;
  }
}
