import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  type CheckoutResponse,
  type DeliveryMethod,
  type ShippingAddressInput,
} from '@decathlon/shared';
import { apiClient } from '../../lib/apiClient';
import { useCart } from '../cart/queries';
import { useAuth } from '../auth/AuthContext';
import { Button } from '../../ui/Button';

const EMPTY_ADDRESS: ShippingAddressInput = {
  fullName: '',
  phone: '',
  line1: '',
  city: '',
  postalCode: '',
  country: 'BG',
};

export default function CheckoutPage() {
  const { data: cart } = useCart();
  const { user, status } = useAuth();
  const navigate = useNavigate();
  const qc = useQueryClient();

  const { data: options } = useQuery({
    queryKey: ['deliveryOptions', cart?.totalQuantity],
    queryFn: apiClient.getDeliveryOptions,
  });
  const { data: addresses } = useQuery({
    queryKey: ['addresses'],
    queryFn: apiClient.listAddresses,
    enabled: status === 'authenticated',
  });

  const [email, setEmail] = useState('');
  const [method, setMethod] = useState<DeliveryMethod>('home');
  const [address, setAddress] = useState<ShippingAddressInput>(EMPTY_ADDRESS);
  const [checkout, setCheckout] = useState<CheckoutResponse | null>(null);

  useEffect(() => {
    if (user) setEmail((e) => e || user.email);
  }, [user]);
  useEffect(() => {
    const def = addresses?.find((a) => a.isDefault) ?? addresses?.[0];
    if (def) {
      setAddress({
        fullName: def.fullName,
        phone: def.phone,
        line1: def.line1,
        city: def.city,
        postalCode: def.postalCode,
        country: def.country,
      });
    }
  }, [addresses]);

  const placeOrder = useMutation({
    mutationFn: () =>
      apiClient.checkout({ email, deliveryMethod: method, address }),
    onSuccess: (res) => setCheckout(res),
  });
  const confirm = useMutation({
    mutationFn: (succeed: boolean) =>
      apiClient.confirmPayment(checkout!.paymentIntentId, succeed),
    onSuccess: (order) => {
      if (order.status === 'paid') {
        void qc.invalidateQueries({ queryKey: ['cart'] });
        navigate(`/orders/${order.id}`);
      }
    },
  });

  function field(key: keyof ShippingAddressInput) {
    return (e: React.ChangeEvent<HTMLInputElement>) =>
      setAddress((a) => ({ ...a, [key]: e.target.value }));
  }

  if (!cart || cart.items.length === 0) {
    return <p className="mx-auto max-w-3xl text-gray-500">Количката е празна.</p>;
  }

  // Payment step (sandbox)
  if (checkout) {
    return (
      <div className="mx-auto max-w-md text-center">
        <h1 className="mb-4 text-2xl font-bold">Плащане</h1>
        <p className="mb-2 text-gray-600">
          Поръчка на стойност <strong>{checkout.order.total.eurFormatted}</strong> (
          {checkout.order.total.bgnFormatted})
        </p>
        {checkout.sandbox && (
          <p className="mb-6 text-sm text-gray-500">
            Тестов режим на плащане (без реална транзакция).
          </p>
        )}
        {confirm.isError && <p className="mb-3 text-sm text-red-600">Грешка при плащане.</p>}
        <div className="flex justify-center gap-3">
          <Button disabled={confirm.isPending} onClick={() => confirm.mutate(true)}>
            {confirm.isPending ? 'Обработка…' : 'Симулирай успешно плащане'}
          </Button>
          <Button variant="secondary" disabled={confirm.isPending} onClick={() => confirm.mutate(false)}>
            Симулирай неуспех
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-[1fr_20rem]">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          placeOrder.mutate();
        }}
        className="space-y-6"
      >
        <section>
          <h2 className="mb-3 text-lg font-semibold">Контакт</h2>
          <input
            type="email"
            required
            placeholder="Имейл"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded border border-gray-300 px-3 py-2"
          />
        </section>

        <section>
          <h2 className="mb-3 text-lg font-semibold">Метод на доставка</h2>
          <div className="space-y-2">
            {options?.map((o) => (
              <label
                key={o.method}
                className="flex cursor-pointer items-center justify-between rounded border border-gray-200 px-3 py-2"
              >
                <span className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="delivery"
                    checked={method === o.method}
                    onChange={() => setMethod(o.method)}
                  />
                  <span>
                    {o.label} <span className="text-gray-500">· {o.etaDays}</span>
                  </span>
                </span>
                <span className="font-medium">{o.free ? 'Безплатно' : o.fee.eurFormatted}</span>
              </label>
            ))}
          </div>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-semibold">Адрес</h2>
          <div className="grid grid-cols-2 gap-3">
            <input required placeholder="Име и фамилия" value={address.fullName} onChange={field('fullName')} className="col-span-2 rounded border border-gray-300 px-3 py-2" />
            <input required placeholder="Телефон" value={address.phone} onChange={field('phone')} className="rounded border border-gray-300 px-3 py-2" />
            <input required placeholder="Град" value={address.city} onChange={field('city')} className="rounded border border-gray-300 px-3 py-2" />
            <input required placeholder="Адрес" value={address.line1} onChange={field('line1')} className="col-span-2 rounded border border-gray-300 px-3 py-2" />
            <input required placeholder="Пощенски код" value={address.postalCode} onChange={field('postalCode')} className="rounded border border-gray-300 px-3 py-2" />
            <input required placeholder="Държава" value={address.country} onChange={field('country')} className="rounded border border-gray-300 px-3 py-2" />
          </div>
        </section>

        {placeOrder.isError && (
          <p className="text-sm text-red-600">
            {placeOrder.error instanceof Error ? placeOrder.error.message : 'Грешка'}
          </p>
        )}
        <Button type="submit" disabled={placeOrder.isPending}>
          {placeOrder.isPending ? 'Създаване…' : 'Продължи към плащане'}
        </Button>
      </form>

      <aside className="h-fit rounded-lg border border-gray-200 p-4">
        <h2 className="mb-3 font-semibold">Обобщение</h2>
        <ul className="mb-3 space-y-2 text-sm">
          {cart.items.map((i) => (
            <li key={i.itemId} className="flex justify-between gap-2">
              <span className="line-clamp-1">
                {i.quantity}× {i.productName} ({i.size})
              </span>
              <span className="whitespace-nowrap">{i.lineTotal.eurFormatted}</span>
            </li>
          ))}
        </ul>
        <div className="flex justify-between border-t border-gray-200 pt-3 font-bold">
          <span>Междинна сума</span>
          <span>{cart.subtotal.eurFormatted}</span>
        </div>
        <div className="text-right text-sm text-gray-500">{cart.subtotal.bgnFormatted}</div>
      </aside>
    </div>
  );
}
