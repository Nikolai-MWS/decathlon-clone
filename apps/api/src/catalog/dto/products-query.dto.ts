import { Type } from 'class-transformer';
import { IsIn, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { type ProductSort } from '@decathlon/shared';

export class ProductsQueryDto {
  @IsOptional()
  @IsString()
  categorySlug?: string;

  @IsOptional()
  @IsString()
  brandSlug?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(60)
  pageSize?: number;

  @IsOptional()
  @IsIn(['newest', 'price_asc', 'price_desc', 'rating'])
  sort?: ProductSort;
}
