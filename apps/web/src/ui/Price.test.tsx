import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { type PriceDto } from '@decathlon/shared';
import { Price } from './Price';

const discounted: PriceDto = {
  current: { eurCents: 5899, bgnCents: 11537, eurFormatted: '58,99 €', bgnFormatted: '115,37 лв.' },
  old: { eurCents: 6649, bgnCents: 13004, eurFormatted: '66,49 €', bgnFormatted: '130,04 лв.' },
  discountPct: 11,
  promoStart: null,
  promoEnd: null,
};

describe('Price', () => {
  it('shows current + old price, discount badge, and both currencies when discounted', () => {
    render(<Price price={discounted} />);
    expect(screen.getByText('58,99 €')).toBeInTheDocument();
    expect(screen.getByText('66,49 €')).toBeInTheDocument();
    expect(screen.getByText('-11%')).toBeInTheDocument();
    expect(screen.getByText('115,37 лв.')).toBeInTheDocument();
  });

  it('omits the old price and discount badge at full price', () => {
    render(<Price price={{ ...discounted, old: null, discountPct: null }} />);
    expect(screen.getByText('58,99 €')).toBeInTheDocument();
    expect(screen.queryByText('66,49 €')).not.toBeInTheDocument();
    expect(screen.queryByText('-11%')).not.toBeInTheDocument();
  });
});
