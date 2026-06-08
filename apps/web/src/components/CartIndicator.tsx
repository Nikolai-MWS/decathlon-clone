import { Link } from 'react-router-dom';
import { useCart } from '../features/cart/queries';

export default function CartIndicator() {
  const { data: cart } = useCart();
  const count = cart?.totalQuantity ?? 0;
  return (
    <Link to="/cart" className="relative flex items-center gap-1 text-sm" aria-label="Количка">
      <span>🛒</span>
      <span className="hidden sm:inline">Количка</span>
      {count > 0 && (
        <span className="absolute -right-3 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-white px-1 text-xs font-bold text-brand">
          {count}
        </span>
      )}
    </Link>
  );
}
