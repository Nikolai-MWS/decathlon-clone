import { Link } from 'react-router-dom';
import { type ProductCardDto } from '@decathlon/shared';
import { Price } from './Price';
import { RatingStars } from './RatingStars';

export function ProductCard({ product }: { product: ProductCardDto }) {
  return (
    <Link
      to={`/p/${product.slug}`}
      className="group flex flex-col rounded-lg border border-gray-200 bg-white p-3 transition-shadow hover:shadow-md"
    >
      <div className="relative mb-3 aspect-square overflow-hidden rounded bg-gray-50">
        {product.price.discountPct !== null && (
          <span className="absolute left-2 top-2 z-10 rounded bg-red-600 px-2 py-0.5 text-xs font-bold text-white">
            НАМАЛЕНИЕ
          </span>
        )}
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-contain transition-transform group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-gray-300">—</div>
        )}
      </div>
      <span className="text-xs font-semibold uppercase text-gray-500">{product.brand}</span>
      <h3 className="mb-1 line-clamp-2 min-h-[2.5rem] text-sm font-medium text-gray-900">
        {product.name}
      </h3>
      <div className="mb-2">
        <RatingStars value={product.ratingAvg} reviewCount={product.reviewCount} />
      </div>
      <div className="mt-auto">
        <Price price={product.price} />
      </div>
    </Link>
  );
}
