import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';
import { type ProductCardDto } from '@decathlon/shared';
import { ProductCard } from './ProductCard';

const base: ProductCardDto = {
  id: '1',
  name: 'Hiking Shoes MH500',
  slug: 'mh500',
  brand: 'Quechua',
  image: 'http://example.com/a.jpg',
  ratingAvg: 4.6,
  reviewCount: 502,
  price: {
    current: { eurCents: 5899, bgnCents: 11537, eurFormatted: '58,99 €', bgnFormatted: '115,37 лв.' },
    old: { eurCents: 6649, bgnCents: 13004, eurFormatted: '66,49 €', bgnFormatted: '130,04 лв.' },
    discountPct: 11,
    promoStart: null,
    promoEnd: null,
  },
};

function renderCard(product: ProductCardDto) {
  return render(
    <MemoryRouter>
      <ProductCard product={product} />
    </MemoryRouter>,
  );
}

describe('ProductCard', () => {
  it('renders brand, name, dual-currency price and links to the product', () => {
    renderCard(base);
    expect(screen.getByText('Quechua')).toBeInTheDocument();
    expect(screen.getByText('Hiking Shoes MH500')).toBeInTheDocument();
    expect(screen.getByText('58,99 €')).toBeInTheDocument();
    expect(screen.getByText('115,37 лв.')).toBeInTheDocument();
    expect(screen.getByRole('link')).toHaveAttribute('href', '/p/mh500');
  });

  it('shows a discount badge when discounted', () => {
    renderCard(base);
    expect(screen.getByText('НАМАЛЕНИЕ')).toBeInTheDocument();
    expect(screen.getByText('-11%')).toBeInTheDocument();
  });

  it('omits the discount badge at full price', () => {
    renderCard({ ...base, price: { ...base.price, old: null, discountPct: null } });
    expect(screen.queryByText('НАМАЛЕНИЕ')).not.toBeInTheDocument();
  });
});
