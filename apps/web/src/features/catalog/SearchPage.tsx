import { useSearchParams } from 'react-router-dom';
import { type ProductQuery, type ProductSort } from '@decathlon/shared';
import { useProducts, useFacets } from './queries';
import { ProductCard } from '../../ui/ProductCard';
import { Button } from '../../ui/Button';

const SORTS: { value: ProductSort; label: string }[] = [
  { value: 'newest', label: 'Най-нови' },
  { value: 'price_asc', label: 'Цена ↑' },
  { value: 'price_desc', label: 'Цена ↓' },
  { value: 'rating', label: 'Рейтинг' },
];

export default function SearchPage() {
  const [params, setParams] = useSearchParams();

  const q = params.get('q') ?? '';
  const selectedBrands = (params.get('brandSlugs') ?? '').split(',').filter(Boolean);
  const minPrice = params.get('minPriceEur');
  const maxPrice = params.get('maxPriceEur');
  const onSale = params.get('onSale') === 'true';
  const minRating = params.get('minRating');
  const sort = (params.get('sort') as ProductSort) || 'newest';
  const page = Number(params.get('page') ?? '1');

  const query: ProductQuery = {
    q: q || undefined,
    brandSlugs: selectedBrands.length ? selectedBrands.join(',') : undefined,
    minPriceEur: minPrice ? Number(minPrice) : undefined,
    maxPriceEur: maxPrice ? Number(maxPrice) : undefined,
    minRating: minRating ? Number(minRating) : undefined,
    onSale: onSale || undefined,
    sort,
    page,
    pageSize: 12,
  };

  const { data, isLoading } = useProducts(query);
  const { data: facets } = useFacets(query);

  function update(mutate: (p: URLSearchParams) => void, resetPage = true) {
    const next = new URLSearchParams(params);
    mutate(next);
    if (resetPage) next.delete('page');
    setParams(next);
  }

  function toggleBrand(slug: string) {
    const set = new Set(selectedBrands);
    if (set.has(slug)) set.delete(slug);
    else set.add(slug);
    update((p) => {
      const list = [...set];
      if (list.length) p.set('brandSlugs', list.join(','));
      else p.delete('brandSlugs');
    });
  }

  function setParam(key: string, value: string | null) {
    update((p) => {
      if (value) p.set(key, value);
      else p.delete(key);
    });
  }

  return (
    <div className="mx-auto max-w-7xl">
      <h1 className="mb-6 text-2xl font-bold">
        {q ? <>Резултати за „{q}“</> : 'Всички продукти'}
        {facets && <span className="ml-2 text-base font-normal text-gray-500">({facets.total})</span>}
      </h1>

      <div className="grid gap-8 md:grid-cols-[16rem_1fr]">
        {/* Filters */}
        <aside className="space-y-6">
          <div>
            <h2 className="mb-2 font-semibold">Марка</h2>
            <ul className="space-y-1">
              {facets?.brands.map((b) => (
                <li key={b.slug}>
                  <label className="flex cursor-pointer items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={selectedBrands.includes(b.slug)}
                      onChange={() => toggleBrand(b.slug)}
                    />
                    {b.name} <span className="text-gray-400">({b.count})</span>
                  </label>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="mb-2 font-semibold">Цена (€)</h2>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min={0}
                placeholder="от"
                defaultValue={minPrice ?? ''}
                onBlur={(e) => setParam('minPriceEur', e.target.value || null)}
                className="w-20 rounded border border-gray-300 px-2 py-1 text-sm"
              />
              <span>–</span>
              <input
                type="number"
                min={0}
                placeholder="до"
                defaultValue={maxPrice ?? ''}
                onBlur={(e) => setParam('maxPriceEur', e.target.value || null)}
                className="w-20 rounded border border-gray-300 px-2 py-1 text-sm"
              />
            </div>
          </div>

          <div>
            <h2 className="mb-2 font-semibold">Рейтинг</h2>
            <select
              value={minRating ?? ''}
              onChange={(e) => setParam('minRating', e.target.value || null)}
              className="w-full rounded border border-gray-300 px-2 py-1 text-sm"
            >
              <option value="">Всички</option>
              <option value="4">4★ и нагоре</option>
              <option value="4.5">4.5★ и нагоре</option>
            </select>
          </div>

          <label className="flex cursor-pointer items-center gap-2 text-sm font-medium">
            <input
              type="checkbox"
              checked={onSale}
              onChange={(e) => setParam('onSale', e.target.checked ? 'true' : null)}
            />
            Само намалени
          </label>
        </aside>

        {/* Results */}
        <div>
          <div className="mb-4 flex justify-end">
            <select
              value={sort}
              onChange={(e) => setParam('sort', e.target.value)}
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
            <p className="text-gray-500">Няма намерени продукти.</p>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                {data.items.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
              <div className="mt-8 flex items-center justify-center gap-4">
                <Button
                  variant="secondary"
                  disabled={page <= 1}
                  onClick={() => setParam('page', String(page - 1))}
                >
                  Назад
                </Button>
                <span className="text-sm text-gray-600">
                  {data.page} / {data.totalPages}
                </span>
                <Button
                  variant="secondary"
                  disabled={page >= data.totalPages}
                  onClick={() => setParam('page', String(page + 1))}
                >
                  Напред
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
