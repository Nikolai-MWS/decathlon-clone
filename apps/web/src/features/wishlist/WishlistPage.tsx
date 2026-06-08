import { Link } from 'react-router-dom';
import { useWishlist } from './queries';
import { ProductCard } from '../../ui/ProductCard';

export default function WishlistPage() {
  const { data: items, isLoading } = useWishlist();

  if (isLoading) return <p className="text-gray-500">Зареждане…</p>;

  if (!items || items.length === 0) {
    return (
      <div className="mx-auto max-w-3xl text-center">
        <h1 className="mb-4 text-2xl font-bold">Списъкът с любими е празен</h1>
        <Link to="/" className="text-brand underline">
          Към пазаруване
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl">
      <h1 className="mb-6 text-2xl font-bold">Любими ({items.length})</h1>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {items.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  );
}
