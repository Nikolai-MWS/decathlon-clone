import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { type ProductSort } from '@decathlon/shared';
import { useProducts, useCategories } from './queries';
import { ProductCard } from '../../ui/ProductCard';
import { Button } from '../../ui/Button';

const SORTS: { value: ProductSort; label: string }[] = [
  { value: 'newest', label: 'Най-нови' },
  { value: 'price_asc', label: 'Цена ↑' },
  { value: 'price_desc', label: 'Цена ↓' },
  { value: 'rating', label: 'Рейтинг' },
];

function findName(
  nodes: { slug: string; name: string; children: { slug: string; name: string }[] }[] | undefined,
  slug: string,
): string | undefined {
  if (!nodes) return undefined;
  for (const n of nodes) {
    if (n.slug === slug) return n.name;
    const child = n.children.find((c) => c.slug === slug);
    if (child) return child.name;
  }
  return undefined;
}

export default function CategoryPage() {
  const { slug = '' } = useParams();
  const [sort, setSort] = useState<ProductSort>('newest');
  const [page, setPage] = useState(1);
  const { data, isLoading } = useProducts({ categorySlug: slug, sort, page, pageSize: 12 });
  const { data: categories } = useCategories();
  const name = findName(categories, slug) ?? slug;

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">{name}</h1>
        <select
          value={sort}
          onChange={(e) => {
            setSort(e.target.value as ProductSort);
            setPage(1);
          }}
          className="rounded border border-gray-300 px-3 py-2 text-sm"
          aria-label="Сортиране"
        >
          {SORTS.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
      </div>

      {isLoading ? (
        <p className="text-gray-500">Зареждане…</p>
      ) : !data || data.items.length === 0 ? (
        <p className="text-gray-500">Няма продукти в тази категория.</p>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {data.items.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
          <div className="mt-8 flex items-center justify-center gap-4">
            <Button
              variant="secondary"
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
            >
              Назад
            </Button>
            <span className="text-sm text-gray-600">
              {data.page} / {data.totalPages}
            </span>
            <Button
              variant="secondary"
              disabled={page >= data.totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              Напред
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
