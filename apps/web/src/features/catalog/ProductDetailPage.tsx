import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useProduct } from './queries';
import { useAddToCart } from '../cart/queries';
import { Price } from '../../ui/Price';
import { RatingStars } from '../../ui/RatingStars';
import { Button } from '../../ui/Button';

export default function ProductDetailPage() {
  const { slug = '' } = useParams();
  const { data: product, isLoading, isError } = useProduct(slug);
  const [variantIndex, setVariantIndex] = useState(0);
  const [imageIndex, setImageIndex] = useState(0);
  const [selectedSku, setSelectedSku] = useState<string | null>(null);
  const addToCart = useAddToCart();

  if (isLoading) return <p className="text-gray-500">Зареждане…</p>;
  if (isError || !product) return <p className="text-gray-500">Продуктът не е намерен.</p>;

  const variant = product.variants[variantIndex] ?? product.variants[0];
  const images = variant?.images ?? [];

  return (
    <div className="mx-auto max-w-6xl">
      <nav className="mb-4 text-sm text-gray-500" aria-label="breadcrumb">
        {product.category.map((c, i) => (
          <span key={c.slug}>
            <Link to={`/c/${c.slug}`} className="hover:text-brand">
              {c.name}
            </Link>
            {i < product.category.length - 1 && <span className="mx-1">/</span>}
          </span>
        ))}
      </nav>

      <div className="grid gap-8 md:grid-cols-2">
        {/* Gallery */}
        <div>
          <div className="mb-3 aspect-square overflow-hidden rounded-lg bg-gray-50">
            {images[imageIndex] ? (
              <img
                src={images[imageIndex]}
                alt={product.name}
                className="h-full w-full object-contain"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-gray-300">—</div>
            )}
          </div>
          <div className="flex gap-2">
            {images.map((url, i) => (
              <button
                key={url}
                type="button"
                onClick={() => setImageIndex(i)}
                className={`h-16 w-16 overflow-hidden rounded border ${i === imageIndex ? 'border-brand' : 'border-gray-200'}`}
              >
                <img src={url} alt="" className="h-full w-full object-contain" />
              </button>
            ))}
          </div>
        </div>

        {/* Details */}
        <div>
          <span className="text-sm font-semibold uppercase text-gray-500">
            {product.brand.name}
          </span>
          <h1 className="mb-2 text-2xl font-bold">{product.name}</h1>
          <div className="mb-4">
            <RatingStars value={product.ratingAvg} reviewCount={product.reviewCount} />
          </div>
          <div className="mb-6">
            <Price price={product.price} size="lg" />
          </div>

          <p className="mb-6 text-gray-700">{product.description}</p>

          {/* Color variants */}
          {product.variants.length > 1 && (
            <div className="mb-6">
              <p className="mb-2 text-sm font-medium">
                Цвят: <span className="text-gray-600">{variant?.colorName}</span>
              </p>
              <div className="flex gap-2">
                {product.variants.map((v, i) => (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => {
                      setVariantIndex(i);
                      setImageIndex(0);
                      setSelectedSku(null);
                    }}
                    className={`rounded border px-3 py-1 text-sm ${i === variantIndex ? 'border-brand text-brand' : 'border-gray-300'}`}
                  >
                    {v.colorName}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Size selector */}
          <div className="mb-6">
            <p className="mb-2 text-sm font-medium">Размер</p>
            <div className="flex flex-wrap gap-2">
              {variant?.skus.map((sku) => (
                <button
                  key={sku.id}
                  type="button"
                  disabled={!sku.inStock}
                  onClick={() => setSelectedSku(sku.id)}
                  className={`min-w-[3rem] rounded border px-3 py-2 text-sm ${
                    selectedSku === sku.id ? 'border-brand bg-brand text-white' : 'border-gray-300'
                  } disabled:cursor-not-allowed disabled:border-gray-200 disabled:bg-gray-100 disabled:text-gray-300 disabled:line-through`}
                >
                  {sku.size}
                </button>
              ))}
            </div>
            {variant?.skus.some((s) => !s.inStock) && (
              <p className="mt-2 text-xs text-gray-500">
                Някои размери не са налични към момента.
              </p>
            )}
          </div>

          <Button
            disabled={!selectedSku || addToCart.isPending}
            className="w-full sm:w-auto"
            onClick={() => selectedSku && addToCart.mutate({ skuId: selectedSku, quantity: 1 })}
          >
            {addToCart.isPending ? 'Добавяне…' : 'Добави в количката'}
          </Button>
          {!selectedSku && (
            <p className="mt-2 text-xs text-gray-500">Избери размер, за да продължиш.</p>
          )}
          {addToCart.isSuccess && selectedSku && (
            <p className="mt-2 text-sm text-green-600">Добавено в количката ✓</p>
          )}
          {addToCart.isError && (
            <p className="mt-2 text-sm text-red-600">{addToCart.error.message}</p>
          )}
        </div>
      </div>
    </div>
  );
}
