import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { type Request } from 'express';
import {
  type CheckoutResponse,
  type DeliveryOptionDto,
  type OrderDto,
} from '@decathlon/shared';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser, AuthenticatedUser } from '../auth/current-user.decorator';
import { CartService } from '../cart/cart.service';
import { OrdersService } from './orders.service';
import { CheckoutDto, ConfirmPaymentDto } from './dto/checkout.dto';

@Controller()
export class OrdersController {
  constructor(
    private readonly orders: OrdersService,
    private readonly cart: CartService,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
  ) {}

  private cartId(req: Request): string | undefined {
    return (req.cookies as Record<string, string> | undefined)?.cartId;
  }

  /** Decode the optional access token; checkout works for guests too. */
  private optionalUserId(req: Request): string | null {
    const header = req.headers.authorization;
    if (!header?.startsWith('Bearer ')) return null;
    try {
      const payload = this.jwt.verify<{ sub: string }>(header.slice(7), {
        secret: this.config.get<string>('jwt.accessSecret'),
      });
      return payload.sub;
    } catch {
      return null;
    }
  }

  @Get('checkout/options')
  async options(@Req() req: Request): Promise<DeliveryOptionDto[]> {
    const cartId = this.cartId(req);
    const cart = cartId ? await this.cart.getCartDto(cartId) : null;
    return this.orders.deliveryOptions(cart?.subtotal.eurCents ?? 0);
  }

  @Post('checkout')
  checkout(@Body() dto: CheckoutDto, @Req() req: Request): Promise<CheckoutResponse> {
    return this.orders.checkout(this.cartId(req), this.optionalUserId(req), dto);
  }

  @Post('checkout/confirm')
  confirm(@Body() dto: ConfirmPaymentDto, @Req() req: Request): Promise<OrderDto> {
    return this.orders.confirmSandbox(dto.paymentIntentId, dto.succeed, this.cartId(req));
  }

  @UseGuards(JwtAuthGuard)
  @Get('orders')
  listOrders(@CurrentUser() user: AuthenticatedUser): Promise<OrderDto[]> {
    return this.orders.listOrders(user.id);
  }

  // Public: order confirmation is reachable by its unguessable UUID.
  @Get('orders/:id')
  getOrder(@Param('id') id: string): Promise<OrderDto> {
    return this.orders.getOrder(id);
  }
}
