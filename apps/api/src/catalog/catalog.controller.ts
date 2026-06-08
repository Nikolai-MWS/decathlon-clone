import { Controller, Get, Param, Query } from '@nestjs/common';
import {
  type BrandDto,
  type CategoryNodeDto,
  type Paginated,
  type ProductCardDto,
  type ProductDetailDto,
} from '@decathlon/shared';
import { CatalogService } from './catalog.service';
import { ProductsQueryDto } from './dto/products-query.dto';

@Controller()
export class CatalogController {
  constructor(private readonly catalog: CatalogService) {}

  @Get('categories')
  getCategories(): Promise<CategoryNodeDto[]> {
    return this.catalog.getCategoryTree();
  }

  @Get('brands')
  getBrands(): Promise<BrandDto[]> {
    return this.catalog.getBrands();
  }

  @Get('products')
  getProducts(@Query() query: ProductsQueryDto): Promise<Paginated<ProductCardDto>> {
    return this.catalog.findProducts(query);
  }

  @Get('products/:slug')
  getProduct(@Param('slug') slug: string): Promise<ProductDetailDto> {
    return this.catalog.getProductBySlug(slug);
  }
}
