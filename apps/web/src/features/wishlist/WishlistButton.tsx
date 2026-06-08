import { useWishlist, useToggleWishlist } from './queries';

export default function WishlistButton({
  productId,
  className = '',
}: {
  productId: string;
  className?: string;
}) {
  const { data: items } = useWishlist();
  const toggle = useToggleWishlist();
  const inList = !!items?.some((p) => p.id === productId);

  return (
    <button
      type="button"
      aria-label={inList ? 'Премахни от любими' : 'Добави в любими'}
      aria-pressed={inList}
      disabled={toggle.isPending}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggle.mutate({ productId, inList });
      }}
      className={`text-xl transition-transform hover:scale-110 ${inList ? 'text-red-500' : 'text-gray-300'} ${className}`}
    >
      {inList ? '♥' : '♡'}
    </button>
  );
}
