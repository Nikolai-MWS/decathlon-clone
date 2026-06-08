import { type Money } from './money';

export interface CartLineDto {
  itemId: string;
  productSlug: string;
  productName: string;
  brand: string;
  color: string;
  size: string;
  image: string | null;
  unitPrice: Money;
  quantity: number;
  lineTotal: Money;
  maxStock: number;
}

export interface CartDto {
  id: string;
  items: CartLineDto[];
  totalQuantity: number;
  subtotal: Money;
}

export interface AddCartItemDto {
  skuId: string;
  quantity: number;
}

export interface UpdateCartItemDto {
  quantity: number;
}
