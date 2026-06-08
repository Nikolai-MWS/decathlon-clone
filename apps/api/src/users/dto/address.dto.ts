import { IsBoolean, IsOptional, IsString, MinLength } from 'class-validator';

export class AddressInputDto {
  @IsString()
  @MinLength(1)
  fullName!: string;

  @IsString()
  phone!: string;

  @IsString()
  @MinLength(1)
  line1!: string;

  @IsString()
  @MinLength(1)
  city!: string;

  @IsString()
  @MinLength(1)
  postalCode!: string;

  @IsString()
  @MinLength(2)
  country!: string;

  @IsOptional()
  @IsBoolean()
  isDefault?: boolean;
}
