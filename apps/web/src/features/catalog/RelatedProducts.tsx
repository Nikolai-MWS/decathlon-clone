import { useRelated } from './queries';
import { ProductCard } from '../../ui/ProductCard';

export default function RelatedProducts({ slug }: { slug: string }) {
  const { data } = useRelated(slug);
  if (!data || data.length === 0) return null;

  return (
    <section className="mt-12 border-t border-gray-200 pt-8">
      <h2 className="mb-4 text-xl font-bold">Подобни продукти</h2>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {data.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  );
}
