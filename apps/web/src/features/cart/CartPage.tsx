import { Link } from 'react-router-dom';
import { useCart, useRemoveCartItem, useUpdateCartItem } from './queries';
import { Button } from '../../ui/Button';

export default function CartPage() {
  const { data: cart, isLoading } = useCart();
  const update = useUpdateCartItem();
  const remove = useRemoveCartItem();

  if (isLoading) return <p className="text-gray-500">Зареждане…</p>;

  if (!cart || cart.items.length === 0) {
    return (
      <div className="mx-auto max-w-3xl text-center">
        <h1 className="mb-4 text-2xl font-bold">Количката е празна</h1>
        <Link to="/" className="text-brand underline">
          Към пазаруване
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="mb-6 text-2xl font-bold">Количка ({cart.totalQuantity})</h1>
      <ul className="divide-y divide-gray-200 border-y border-gray-200">
        {cart.items.map((item) => (
          <li key={item.itemId} className="flex gap-4 py-4">
            <div className="h-20 w-20 shrink-0 overflow-hidden rounded bg-gray-50">
              {item.image && <img src={item.image} alt="" className="h-full w-full object-contain" />}
            </div>
            <div className="flex flex-1 flex-col">
              <span className="text-xs font-semibold uppercase text-gray-500">{item.brand}</span>
              <Link to={`/p/${item.productSlug}`} className="text-sm font-medium hover:text-brand">
                {item.productName}
              </Link>
              <span className="text-xs text-gray-500">
                {item.color} · Размер {item.size}
              </span>
              <div className="mt-2 flex items-center gap-3">
                <select
                  value={item.quantity}
                  onChange={(e) =>
                    update.mutate({ itemId: item.itemId, quantity: Number(e.target.value) })
                  }
                  className="rounded border border-gray-300 px-2 py-1 text-sm"
                  aria-label="Количество"
                >
                  {Array.from({ length: item.maxStock }, (_, i) => i + 1).map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => remove.mutate(item.itemId)}
                  className="text-sm text-gray-500 underline hover:text-red-600"
                >
                  Премахни
                </button>
              </div>
            </div>
            <div className="text-right">
              <div className="font-bold">{item.lineTotal.eurFormatted}</div>
              <div className="text-xs text-gray-500">{item.lineTotal.bgnFormatted}</div>
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-6 flex flex-col items-end gap-3">
        <div className="text-right">
          <div className="text-sm text-gray-500">Междинна сума</div>
          <div className="text-2xl font-bold">{cart.subtotal.eurFormatted}</div>
          <div className="text-sm text-gray-500">{cart.subtotal.bgnFormatted}</div>
        </div>
        <Link to="/checkout">
          <Button>Към плащане</Button>
        </Link>
      </div>
    </div>
  );
}
