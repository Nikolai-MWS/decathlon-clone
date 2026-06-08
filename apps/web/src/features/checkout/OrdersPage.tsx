import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../../lib/apiClient';

const STATUS_LABEL: Record<string, string> = {
  pending: 'Изчаква плащане',
  paid: 'Платена',
  failed: 'Неуспешна',
  cancelled: 'Отказана',
};

export default function OrdersPage() {
  const { data: orders, isLoading } = useQuery({ queryKey: ['orders'], queryFn: apiClient.getOrders });

  if (isLoading) return <p className="text-gray-500">Зареждане…</p>;

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="mb-6 text-2xl font-bold">Моите поръчки</h1>
      {!orders || orders.length === 0 ? (
        <p className="text-gray-500">Нямаш поръчки.</p>
      ) : (
        <ul className="space-y-3">
          {orders.map((o) => (
            <li key={o.id}>
              <Link
                to={`/orders/${o.id}`}
                className="flex items-center justify-between rounded border border-gray-200 p-4 hover:border-brand"
              >
                <div>
                  <div className="font-medium">№{o.id.slice(0, 8).toUpperCase()}</div>
                  <div className="text-sm text-gray-500">
                    {new Date(o.createdAt).toLocaleDateString('bg-BG')} · {o.items.length} артикула ·{' '}
                    {STATUS_LABEL[o.status]}
                  </div>
                </div>
                <div className="font-bold">{o.total.eurFormatted}</div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
