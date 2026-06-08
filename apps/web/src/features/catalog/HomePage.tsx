import { Link } from 'react-router-dom';
import { useProducts, useCategories } from './queries';
import { ProductCard } from '../../ui/ProductCard';

export default function HomePage() {
  const { data: popular, isLoading } = useProducts({ sort: 'rating', pageSize: 8 });
  const { data: categories } = useCategories();
  const sports = categories?.find((c) => c.slug === 'all-sports')?.children ?? [];

  return (
    <div className="mx-auto max-w-7xl space-y-10">
      <section className="rounded-xl bg-gradient-to-r from-brand to-brand-dark px-8 py-14 text-white">
        <h1 className="text-3xl font-extrabold sm:text-4xl">Спорт за всички. Всичко за спорта.</h1>
        <p className="mt-2 max-w-xl text-white/90">
          Открий екипировка за над 60 спорта на непобедима цена.
        </p>
      </section>

      {sports.length > 0 && (
        <section>
          <h2 className="mb-4 text-xl font-bold">Популярни категории</h2>
          <div className="flex flex-wrap gap-3">
            {sports.map((c) => (
              <Link
                key={c.id}
                to={`/c/${c.slug}`}
                className="rounded-full border border-gray-300 px-4 py-2 text-sm font-medium hover:border-brand hover:text-brand"
              >
                {c.name}
              </Link>
            ))}
          </div>
        </section>
      )}

      <section>
        <h2 className="mb-4 text-xl font-bold">Популярни продукти</h2>
        {isLoading ? (
          <p className="text-gray-500">Зареждане…</p>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {popular?.items.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
