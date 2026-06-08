import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Brand } from './entities/brand.entity';
import { Category } from './entities/category.entity';
import { Price } from './entities/price.entity';
import { Product } from './entities/product.entity';
import { ProductImage } from './entities/product-image.entity';
import { ProductVariant } from './entities/product-variant.entity';
import { Sku } from './entities/sku.entity';
import { CatalogController } from './catalog.controller';
import { CatalogService } from './catalog.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Category,
      Brand,
      Product,
      ProductVariant,
      ProductImage,
      Sku,
      Price,
    ]),
  ],
  controllers: [CatalogController],
  providers: [CatalogService],
})
export class CatalogModule {}
