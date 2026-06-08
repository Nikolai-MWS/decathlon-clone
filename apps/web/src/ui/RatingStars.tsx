interface RatingStarsProps {
  value: number;
  reviewCount?: number;
}

export function RatingStars({ value, reviewCount }: RatingStarsProps) {
  const rounded = Math.round(value);
  return (
    <div className="flex items-center gap-1 text-sm" aria-label={`${value} out of 5 stars`}>
      <span className="text-amber-500">
        {'★'.repeat(rounded)}
        <span className="text-gray-300">{'★'.repeat(5 - rounded)}</span>
      </span>
      {reviewCount !== undefined && <span className="text-gray-500">({reviewCount})</span>}
    </div>
  );
}
