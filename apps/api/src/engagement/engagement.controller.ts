import { Body, Controller, Delete, Get, Param, Post, Req, Res } from '@nestjs/common';
import { type Request, type Response } from 'express';
import { type ProductCardDto } from '@decathlon/shared';
import { EngagementService } from './engagement.service';
import { NewsletterDto, StockNotificationDto, WishlistItemDto } from './dto/engagement.dto';

const WISHLIST_COOKIE = 'wishlistId';
const COOKIE_MAX_AGE = 90 * 24 * 60 * 60 * 1000;

@Controller()
export class EngagementController {
  constructor(private readonly engagement: EngagementService) {}

  @Get('wishlist')
  async getWishlist(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<ProductCardDto[]> {
    const id = await this.ensureWishlist(req, res);
    return this.engagement.getWishlist(id);
  }

  @Post('wishlist/items')
  async add(
    @Body() body: WishlistItemDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<ProductCardDto[]> {
    const id = await this.ensureWishlist(req, res);
    return this.engagement.addToWishlist(id, body.productId);
  }

  @Delete('wishlist/items/:productId')
  async remove(
    @Param('productId') productId: string,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<ProductCardDto[]> {
    const id = await this.ensureWishlist(req, res);
    return this.engagement.removeFromWishlist(id, productId);
  }

  @Post('newsletter')
  subscribe(@Body() body: NewsletterDto): Promise<{ ok: true }> {
    return this.engagement.subscribe(body.email);
  }

  @Post('stock-notifications')
  notify(@Body() body: StockNotificationDto): Promise<{ ok: true }> {
    return this.engagement.notifyWhenInStock(body.skuId, body.email);
  }

  private async ensureWishlist(req: Request, res: Response): Promise<string> {
    const existing = (req.cookies as Record<string, string> | undefined)?.[WISHLIST_COOKIE];
    if (existing && (await this.engagement.wishlistExists(existing))) return existing;
    const wishlist = await this.engagement.createWishlist();
    res.cookie(WISHLIST_COOKIE, wishlist.id, {
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      maxAge: COOKIE_MAX_AGE,
    });
    return wishlist.id;
  }
}
