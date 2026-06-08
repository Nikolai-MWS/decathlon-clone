import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../../lib/apiClient';

const STATUS_LABEL: Record<string, string> = {
  pending: 'Изчаква плащане',
  paid: 'Платена',
  failed: 'Неуспешно плащане',
  cancelled: 'Отказана',
};

export default function OrderConfirmationPage() {
  const { id = '' } = useParams();
  const { data: order, isLoading, isError } = useQuery({
    queryKey: ['order', id],
    queryFn: () => apiClient.getOrder(id),
  });

  if (isLoading) return <p className="text-gray-500">Зареждане…</p>;
  if (isError || !order) return <p className="text-gray-500">Поръчката не е намерена.</p>;

  return (
    <div className="mx-auto max-w-2xl">
      {order.status === 'paid' && (
        <div className="mb-6 rounded-lg bg-green-50 p-4 text-green-800">
          <h1 className="text-2xl font-bold">Благодарим за поръчката! ✓</h1>
          <p>Поръчка №{order.id.slice(0, 8).toUpperCase()} · изпратихме потвърждение на {order.email}.</p>
        </div>
      )}
      <div className="mb-2 text-sm text-gray-500">
        Статус: <span className="font-medium text-gray-900">{STATUS_LABEL[order.status]}</span>
      </div>

      <ul className="divide-y divide-gray-200 border-y border-gray-200">
        {order.items.map((i, idx) => (
          <li key={idx} className="flex gap-3 py-3">
            <div className="h-16 w-16 shrink-0 overflow-hidden rounded bg-gray-50">
              {i.image && <img src={i.image} alt="" className="h-full w-full object-contain" />}
            </div>
            <div className="flex-1 text-sm">
              <div className="font-medium">{i.productName}</div>
              <div className="text-gray-500">
                {i.color} · {i.size} · {i.quantity} бр.
              </div>
            </div>
            <div className="text-right text-sm font-medium">{i.lineTotal.eurFormatted}</div>
          </li>
        ))}
      </ul>

      <div className="mt-4 space-y-1 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-500">Междинна сума</span>
          <span>{order.subtotal.eurFormatted}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Доставка</span>
          <span>{order.shipping.eurCents === 0 ? 'Безплатно' : order.shipping.eurFormatted}</span>
        </div>
        <div className="flex justify-between border-t border-gray-200 pt-2 text-lg font-bold">
          <span>Общо</span>
          <span>{order.total.eurFormatted}</span>
        </div>
        <div className="text-right text-gray-500">{order.total.bgnFormatted}</div>
      </div>

      <div className="mt-4 text-sm text-gray-600">
        Доставка до: {order.address.fullName}, {order.address.line1}, {order.address.postalCode}{' '}
        {order.address.city}
      </div>

      <Link to="/" className="mt-6 inline-block text-brand underline">
        Продължи пазаруването
      </Link>
    </div>
  );
}
