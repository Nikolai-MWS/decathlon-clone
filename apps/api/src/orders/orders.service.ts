import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import {
  type CheckoutInput,
  type CheckoutResponse,
  type DeliveryMethod,
  type DeliveryOptionDto,
  type OrderDto,
  eurCentsToMoney,
} from '@decathlon/shared';
import { CartService } from '../cart/cart.service';
import { Sku } from '../catalog/entities/sku.entity';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { PaymentsService } from './payments.service';

interface DeliveryRule {
  method: DeliveryMethod;
  label: string;
  feeEur: number;
  freeOverEur: number | null;
  etaDays: string;
}

const FREE_THRESHOLD = 5000; // 50 € in cents

const DELIVERY_RULES: DeliveryRule[] = [
  { method: 'store', label: 'Вземане от магазин (Click&Collect)', feeEur: 0, freeOverEur: 0, etaDays: '2 работни дни' },
  { method: 'office', label: 'До офис на куриер (Speedy/Econt)', feeEur: 199, freeOverEur: FREE_THRESHOLD, etaDays: '2-3 работни дни' },
  { method: 'home', label: 'До адрес', feeEur: 399, freeOverEur: FREE_THRESHOLD, etaDays: '2-3 работни дни' },
];

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order) private readonly orders: Repository<Order>,
    @InjectRepository(Sku) private readonly skus: Repository<Sku>,
    private readonly cart: CartService,
    private readonly payments: PaymentsService,
    private readonly dataSource: DataSource,
  ) {}

  private shippingFor(method: DeliveryMethod, subtotalEur: number): number {
    const rule = DELIVERY_RULES.find((r) => r.method === method);
    if (!rule) throw new BadRequestException('Invalid delivery method');
    if (rule.freeOverEur !== null && subtotalEur >= rule.freeOverEur) return 0;
    return rule.feeEur;
  }

  async deliveryOptions(subtotalEur: number): Promise<DeliveryOptionDto[]> {
    return DELIVERY_RULES.map((rule) => {
      const fee = rule.freeOverEur !== null && subtotalEur >= rule.freeOverEur ? 0 : rule.feeEur;
      return {
        method: rule.method,
        label: rule.label,
        fee: eurCentsToMoney(fee),
        etaDays: rule.etaDays,
        free: fee === 0,
      };
    });
  }

  async checkout(
    cartId: string | undefined,
    userId: string | null,
    input: CheckoutInput,
  ): Promise<CheckoutResponse> {
    if (!cartId) throw new BadRequestException('Cart is empty');
    const cart = await this.cart.getCartEntity(cartId);
    if (!cart || cart.items.length === 0) throw new BadRequestException('Cart is empty');

    const order = new Order();
    order.userId = userId;
    order.email = input.email;
    order.status = 'pending';
    order.deliveryMethod = input.deliveryMethod;
    order.fullName = input.address.fullName;
    order.phone = input.address.phone;
    order.line1 = input.address.line1;
    order.city = input.address.city;
    order.postalCode = input.address.postalCode;
    order.country = input.address.country;

    let subtotal = 0;
    order.items = cart.items.map((ci) => {
      const sku = ci.sku;
      const variant = sku.variant;
      const product = variant.product;
      const unit = product.price.currentEur;
      subtotal += unit * ci.quantity;
      const image = [...(variant.images ?? [])].sort((a, b) => a.position - b.position)[0];
      const item = new OrderItem();
      item.skuId = sku.id;
      item.productName = product.name;
      item.brand = product.brand.name;
      item.color = variant.colorName;
      item.size = sku.size;
      item.image = image?.url ?? null;
      item.unitEur = unit;
      item.quantity = ci.quantity;
      return item;
    });

    const shipping = this.shippingFor(input.deliveryMethod, subtotal);
    order.subtotalEur = subtotal;
    order.shippingEur = shipping;
    order.totalEur = subtotal + shipping;

    const saved = await this.orders.save(order);
    const intent = await this.payments.createIntent(saved.totalEur, saved.id);
    saved.paymentIntentId = intent.id;
    await this.orders.save(saved);

    return {
      order: await this.getOrder(saved.id),
      paymentIntentId: intent.id,
      clientSecret: intent.clientSecret,
      sandbox: this.payments.sandbox,
    };
  }

  /** Sandbox payment confirmation: marks the order paid (or failed), decrements
   * stock, and clears the cart on success. With real Stripe this work is driven
   * by the webhook instead. */
  async confirmSandbox(
    paymentIntentId: string,
    succeed: boolean,
    cartId: string | undefined,
  ): Promise<OrderDto> {
    const order = await this.orders.findOne({
      where: { paymentIntentId },
      relations: { items: true },
    });
    if (!order) throw new NotFoundException('Order not found');
    if (order.status !== 'pending') return this.getOrder(order.id);

    if (!succeed) {
      order.status = 'failed';
      await this.orders.save(order);
      return this.getOrder(order.id);
    }

    await this.dataSource.transaction(async (manager) => {
      for (const item of order.items) {
        if (item.skuId) {
          await manager
            .createQueryBuilder()
            .update(Sku)
            .set({ stock: () => `GREATEST(stock - ${item.quantity}, 0)` })
            .where('id = :id', { id: item.skuId })
            .execute();
        }
      }
      order.status = 'paid';
      await manager.save(order);
    });

    if (cartId) await this.cart.clearCart(cartId);
    return this.getOrder(order.id);
  }

  async listOrders(userId: string): Promise<OrderDto[]> {
    const rows = await this.orders.find({
      where: { userId },
      relations: { items: true },
      order: { createdAt: 'DESC' },
    });
    return rows.map((o) => this.toDto(o));
  }

  async getOrder(id: string): Promise<OrderDto> {
    const order = await this.orders.findOne({ where: { id }, relations: { items: true } });
    if (!order) throw new NotFoundException('Order not found');
    return this.toDto(order);
  }

  private toDto(order: Order): OrderDto {
    return {
      id: order.id,
      status: order.status,
      email: order.email,
      deliveryMethod: order.deliveryMethod,
      address: {
        fullName: order.fullName,
        phone: order.phone,
        line1: order.line1,
        city: order.city,
        postalCode: order.postalCode,
        country: order.country,
      },
      items: (order.items ?? []).map((i) => ({
        productName: i.productName,
        brand: i.brand,
        color: i.color,
        size: i.size,
        image: i.image,
        unitPrice: eurCentsToMoney(i.unitEur),
        quantity: i.quantity,
        lineTotal: eurCentsToMoney(i.unitEur * i.quantity),
      })),
      subtotal: eurCentsToMoney(order.subtotalEur),
      shipping: eurCentsToMoney(order.shippingEur),
      total: eurCentsToMoney(order.totalEur),
      createdAt: order.createdAt.toISOString(),
    };
  }
}
