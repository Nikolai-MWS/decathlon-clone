import { type Money } from './money';

export type DeliveryMethod = 'store' | 'office' | 'home';
export type OrderStatus = 'pending' | 'paid' | 'failed' | 'cancelled';

export interface DeliveryOptionDto {
  method: DeliveryMethod;
  label: string;
  fee: Money;
  etaDays: string;
  free: boolean;
}

export interface ShippingAddressInput {
  fullName: string;
  phone: string;
  line1: string;
  city: string;
  postalCode: string;
  country: string;
}

export interface CheckoutInput {
  email: string;
  deliveryMethod: DeliveryMethod;
  address: ShippingAddressInput;
}

export interface OrderLineDto {
  productName: string;
  brand: string;
  color: string;
  size: string;
  image: string | null;
  unitPrice: Money;
  quantity: number;
  lineTotal: Money;
}

export interface OrderDto {
  id: string;
  status: OrderStatus;
  email: string;
  deliveryMethod: DeliveryMethod;
  address: ShippingAddressInput;
  items: OrderLineDto[];
  subtotal: Money;
  shipping: Money;
  total: Money;
  createdAt: string;
}

export interface CheckoutResponse {
  order: OrderDto;
  paymentIntentId: string;
  /** Present when a real Stripe key is configured; null in sandbox mode. */
  clientSecret: string | null;
  /** True when using the built-in sandbox payment provider (no Stripe key). */
  sandbox: boolean;
}

export interface ConfirmPaymentInput {
  paymentIntentId: string;
  /** Sandbox only: simulate success or failure. */
  succeed: boolean;
}
