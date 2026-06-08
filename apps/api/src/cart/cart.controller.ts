import { Body, Controller, Delete, Get, Param, Patch, Post, Req, Res } from '@nestjs/common';
import { type Request, type Response } from 'express';
import { type CartDto } from '@decathlon/shared';
import { CartService } from './cart.service';
import { AddCartItemDto, UpdateCartItemDto } from './dto/cart-item.dto';

const CART_COOKIE = 'cartId';
const COOKIE_MAX_AGE = 30 * 24 * 60 * 60 * 1000; // 30 days

@Controller('cart')
export class CartController {
  constructor(private readonly cart: CartService) {}

  @Get()
  async getCart(@Req() req: Request, @Res({ passthrough: true }) res: Response): Promise<CartDto> {
    const cartId = await this.ensureCart(req, res);
    return (await this.cart.getCartDto(cartId))!;
  }

  @Post('items')
  async addItem(
    @Body() body: AddCartItemDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<CartDto> {
    const cartId = await this.ensureCart(req, res);
    return this.cart.addItem(cartId, body.skuId, body.quantity);
  }

  @Patch('items/:itemId')
  async updateItem(
    @Param('itemId') itemId: string,
    @Body() body: UpdateCartItemDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<CartDto> {
    const cartId = await this.ensureCart(req, res);
    return this.cart.updateItem(cartId, itemId, body.quantity);
  }

  @Delete('items/:itemId')
  async removeItem(
    @Param('itemId') itemId: string,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<CartDto> {
    const cartId = await this.ensureCart(req, res);
    return this.cart.removeItem(cartId, itemId);
  }

  /** Returns the caller's cart id, creating a cart + cookie if needed. */
  private async ensureCart(req: Request, res: Response): Promise<string> {
    const existing = (req.cookies as Record<string, string> | undefined)?.[CART_COOKIE];
    if (existing && (await this.cart.getCartDto(existing))) {
      return existing;
    }
    const cart = await this.cart.createCart();
    res.cookie(CART_COOKIE, cart.id, {
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      maxAge: COOKIE_MAX_AGE,
    });
    return cart.id;
  }
}
