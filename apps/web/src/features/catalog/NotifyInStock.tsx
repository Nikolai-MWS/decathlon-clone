import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { type SkuDto } from '@decathlon/shared';
import { apiClient } from '../../lib/apiClient';

export default function NotifyInStock({ skus }: { skus: SkuDto[] }) {
  const outOfStock = skus.filter((s) => !s.inStock);
  const [skuId, setSkuId] = useState(outOfStock[0]?.id ?? '');
  const [email, setEmail] = useState('');
  const notify = useMutation({
    mutationFn: () => apiClient.notifyWhenInStock(skuId, email),
  });

  if (outOfStock.length === 0) return null;

  return (
    <div className="mt-6 rounded-lg border border-gray-200 p-4">
      <p className="mb-2 text-sm font-medium">Получи имейл, когато размерът е наличен</p>
      {notify.isSuccess ? (
        <p className="text-sm text-green-600">Ще те уведомим ✓</p>
      ) : (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (skuId && email) notify.mutate();
          }}
          className="flex flex-wrap gap-2"
        >
          <select
            value={skuId}
            onChange={(e) => setSkuId(e.target.value)}
            className="rounded border border-gray-300 px-2 py-2 text-sm"
            aria-label="Размер"
          >
            {outOfStock.map((s) => (
              <option key={s.id} value={s.id}>
                Размер {s.size}
              </option>
            ))}
          </select>
          <input
            type="email"
            required
            placeholder="Имейл"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1 rounded border border-gray-300 px-3 py-2 text-sm"
          />
          <button
            type="submit"
            disabled={notify.isPending}
            className="rounded bg-gray-800 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
          >
            Уведоми ме
          </button>
        </form>
      )}
    </div>
  );
}
