import { Link } from 'react-router-dom';
import { useWishlist } from '../features/wishlist/queries';

export default function WishlistIndicator() {
  const { data: items } = useWishlist();
  const count = items?.length ?? 0;
  return (
    <Link to="/wishlist" className="relative flex items-center gap-1 text-sm" aria-label="Любими">
      <span>♥</span>
      <span className="hidden sm:inline">Любими</span>
      {count > 0 && (
        <span className="absolute -right-3 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-white px-1 text-xs font-bold text-brand">
          {count}
        </span>
      )}
    </Link>
  );
}
