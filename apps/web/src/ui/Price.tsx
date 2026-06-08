import { type PriceDto } from '@decathlon/shared';

interface PriceProps {
  price: PriceDto;
  size?: 'sm' | 'lg';
}

/** Dual-currency price block (EUR primary, BGN secondary) mirroring decathlon.bg. */
export function Price({ price, size = 'sm' }: PriceProps) {
  const discounted = price.old !== null;
  const big = size === 'lg';
  return (
    <div className="flex flex-col">
      <div className="flex items-baseline gap-2">
        <span
          className={`font-bold ${big ? 'text-2xl' : 'text-lg'} ${discounted ? 'text-red-600' : 'text-gray-900'}`}
        >
          {price.current.eurFormatted}
        </span>
        {discounted && (
          <span className={`text-gray-400 line-through ${big ? 'text-base' : 'text-sm'}`}>
            {price.old!.eurFormatted}
          </span>
        )}
        {price.discountPct !== null && (
          <span className="rounded bg-red-600 px-1.5 py-0.5 text-xs font-bold text-white">
            -{price.discountPct}%
          </span>
        )}
      </div>
      <span className={`text-gray-500 ${big ? 'text-sm' : 'text-xs'}`}>
        {price.current.bgnFormatted}
        {discounted && <span className="ml-2 line-through">{price.old!.bgnFormatted}</span>}
      </span>
    </div>
  );
}
