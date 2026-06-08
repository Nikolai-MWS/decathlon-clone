import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  type BrandDto,
  type BreadcrumbDto,
  type CategoryNodeDto,
  type Paginated,
  type ProductCardDto,
  type ProductDetailDto,
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

  async findProducts(query: ProductsQueryDto): Promise<Paginated<ProductCardDto>> {
    const page = query.page ?? 1;
    const pageSize = query.pageSize ?? 24;
    const [column, direction] = SORT_COLUMNS[query.sort ?? 'newest'];

    const qb = this.products
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.brand', 'brand')
      .leftJoinAndSelect('product.price', 'price')
      .leftJoinAndSelect('product.category', 'category')
      .leftJoinAndSelect('product.variants', 'variant')
      .leftJoinAndSelect('variant.images', 'image')
      .orderBy(column, direction)
      .addOrderBy('image.position', 'ASC')
      .skip((page - 1) * pageSize)
      .take(pageSize);

    if (query.categorySlug) {
      qb.andWhere('category.slug = :categorySlug', { categorySlug: query.categorySlug });
    }
    if (query.brandSlug) {
      qb.andWhere('brand.slug = :brandSlug', { brandSlug: query.brandSlug });
    }

    const [items, total] = await qb.getManyAndCount();
    return {
      items: items.map(toProductCard),
      page,
      pageSize,
      total,
      totalPages: Math.max(1, Math.ceil(total / pageSize)),
    };
  }

  async getProductBySlug(slug: string): Promise<ProductDetailDto> {
    const product = await this.products.findOne({
      where: { slug },
      relations: {
        brand: true,
        category: true,
        price: true,
        variants: { images: true, skus: true },
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
