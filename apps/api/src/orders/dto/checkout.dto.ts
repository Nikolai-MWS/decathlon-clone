import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsEmail,
  IsIn,
  IsString,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { type DeliveryMethod } from '@decathlon/shared';

export class ShippingAddressDto {
  @IsString() @MinLength(1) fullName!: string;
  @IsString() phone!: string;
  @IsString() @MinLength(1) line1!: string;
  @IsString() @MinLength(1) city!: string;
  @IsString() @MinLength(1) postalCode!: string;
  @IsString() @MinLength(2) country!: string;
}

export class CheckoutDto {
  @IsEmail()
  email!: string;

  @IsIn(['store', 'office', 'home'])
  deliveryMethod!: DeliveryMethod;

  @ValidateNested()
  @Type(() => ShippingAddressDto)
  address!: ShippingAddressDto;
}

export class ConfirmPaymentDto {
  @IsString()
  paymentIntentId!: string;

  @IsBoolean()
  succeed!: boolean;
}
