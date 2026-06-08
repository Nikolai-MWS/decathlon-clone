import { Category } from './entities/category.entity';
import { Price } from './entities/price.entity';
import { Product } from './entities/product.entity';
import { buildCategoryTree, toPriceDto, toProductCard } from './catalog.mapper';

describe('catalog.mapper', () => {
  describe('toPriceDto', () => {
    it('maps current + old price to dual-currency money and keeps discount/promo', () => {
      const price = {
        currentEur: 5899,
        oldEur: 6649,
        discountPct: 11,
        promoStart: new Date('2026-05-18T00:00:00.000Z'),
        promoEnd: new Date('2026-06-18T00:00:00.000Z'),
      } as Price;

      const dto = toPriceDto(price);
      expect(dto.current.eurFormatted).toBe('58,99 €');
      expect(dto.current.bgnFormatted).toBe('115,37 лв.');
      expect(dto.old?.eurFormatted).toBe('66,49 €');
      expect(dto.discountPct).toBe(11);
      expect(dto.promoStart).toBe('2026-05-18T00:00:00.000Z');
    });

    it('returns null old/promo when not discounted', () => {
      const price = {
        currentEur: 999,
        oldEur: null,
        discountPct: null,
        promoStart: null,
        promoEnd: null,
      } as Price;
      const dto = toPriceDto(price);
      expect(dto.old).toBeNull();
      expect(dto.discountPct).toBeNull();
      expect(dto.promoStart).toBeNull();
    });
  });

  describe('toProductCard', () => {
    it('uses the lowest-position image of the first variant', () => {
      const product = {
        id: 'p1',
        name: 'Tent',
        slug: 'tent',
        brand: { name: 'Quechua' },
        ratingAvg: '4.6',
        reviewCount: 12,
        price: { currentEur: 2999, oldEur: null, discountPct: null, promoStart: null, promoEnd: null },
        variants: [
          {
            images: [
              { url: 'b.jpg', position: 1 },
              { url: 'a.jpg', position: 0 },
            ],
          },
        ],
      } as unknown as Product;

      const card = toProductCard(product);
      expect(card.brand).toBe('Quechua');
      expect(card.image).toBe('a.jpg');
      expect(card.ratingAvg).toBe(4.6);
      expect(card.price.current.eurFormatted).toBe('29,99 €');
    });

    it('returns null image when there are no images', () => {
      const product = {
        id: 'p2',
        name: 'X',
        slug: 'x',
        brand: { name: 'B' },
        ratingAvg: 0,
        reviewCount: 0,
        price: { currentEur: 100, oldEur: null, discountPct: null, promoStart: null, promoEnd: null },
        variants: [],
      } as unknown as Product;
      expect(toProductCard(product).image).toBeNull();
    });
  });

  describe('buildCategoryTree', () => {
    it('nests children under their parent and returns roots only', () => {
      const cats = [
        { id: '1', name: 'All', slug: 'all', parentId: null },
        { id: '2', name: 'Cycling', slug: 'cycling', parentId: '1' },
        { id: '3', name: 'Running', slug: 'running', parentId: '1' },
        { id: '4', name: 'Men', slug: 'men', parentId: null },
      ] as Category[];

      const tree = buildCategoryTree(cats);
      expect(tree.map((n) => n.slug)).toEqual(['all', 'men']);
      expect(tree[0].children.map((c) => c.slug)).toEqual(['cycling', 'running']);
      expect(tree[1].children).toEqual([]);
    });
  });
});
