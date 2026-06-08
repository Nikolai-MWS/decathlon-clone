import { Type } from 'class-transformer';
import { IsInt, IsString, Max, Min, MinLength } from 'class-validator';

export class CreateReviewDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(5)
  rating!: number;

  @IsString()
  @MinLength(1)
  title!: string;

  @IsString()
  @MinLength(1)
  body!: string;
}
