import { Controller, Get, Param, Query } from '@nestjs/common';
import {
  type BrandDto,
  type CategoryNodeDto,
  type FacetsDto,
  type Paginated,
  type ProductCardDto,
  type ProductDetailDto,
  type SuggestionDto,
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

  @Get('facets')
  getFacets(@Query() query: ProductsQueryDto): Promise<FacetsDto> {
    return this.catalog.getFacets(query);
  }

  @Get('products')
  getProducts(@Query() query: ProductsQueryDto): Promise<Paginated<ProductCardDto>> {
    return this.catalog.findProducts(query);
  }

  // Static route declared before the :slug param route so it is not captured.
  @Get('products/suggest')
  suggest(@Query('q') q = ''): Promise<SuggestionDto[]> {
    return this.catalog.suggest(q);
  }

  @Get('products/:slug/related')
  getRelated(@Param('slug') slug: string): Promise<ProductCardDto[]> {
    return this.catalog.getRelated(slug);
  }

  @Get('products/:slug')
  getProduct(@Param('slug') slug: string): Promise<ProductDetailDto> {
    return this.catalog.getProductBySlug(slug);
  }
}
