import { IsEmail, IsUUID } from 'class-validator';

export class WishlistItemDto {
  @IsUUID()
  productId!: string;
}

export class NewsletterDto {
  @IsEmail()
  email!: string;
}

export class StockNotificationDto {
  @IsUUID()
  skuId!: string;

  @IsEmail()
  email!: string;
}
