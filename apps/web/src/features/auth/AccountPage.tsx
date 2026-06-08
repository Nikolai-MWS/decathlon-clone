import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { type AddressInput } from '@decathlon/shared';
import { useAuth } from './AuthContext';
import { apiClient } from '../../lib/apiClient';
import { Button } from '../../ui/Button';

const EMPTY: AddressInput = {
  fullName: '',
  phone: '',
  line1: '',
  city: '',
  postalCode: '',
  country: 'BG',
  isDefault: false,
};

export default function AccountPage() {
  const { user, logout } = useAuth();
  const qc = useQueryClient();
  const { data: addresses } = useQuery({
    queryKey: ['addresses'],
    queryFn: apiClient.listAddresses,
  });
  const [form, setForm] = useState<AddressInput>(EMPTY);

  const addAddress = useMutation({
    mutationFn: (input: AddressInput) => apiClient.addAddress(input),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['addresses'] });
      setForm(EMPTY);
    },
  });
  const removeAddress = useMutation({
    mutationFn: (id: string) => apiClient.removeAddress(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['addresses'] }),
  });

  function field(key: keyof AddressInput) {
    return (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((f) => ({ ...f, [key]: e.target.value }));
  }

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">
            Здравей, {user?.firstName} {user?.lastName}
          </h1>
          <p className="text-gray-500">{user?.email}</p>
        </div>
        <Button variant="secondary" onClick={() => void logout()}>
          Изход
        </Button>
      </div>

      <section>
        <h2 className="mb-3 text-lg font-semibold">Адреси за доставка</h2>
        {addresses && addresses.length > 0 ? (
          <ul className="space-y-2">
            {addresses.map((a) => (
              <li
                key={a.id}
                className="flex items-start justify-between rounded border border-gray-200 p-3 text-sm"
              >
                <div>
                  <div className="font-medium">
                    {a.fullName} {a.isDefault && <span className="text-brand">(основен)</span>}
                  </div>
                  <div className="text-gray-600">
                    {a.line1}, {a.postalCode} {a.city}, {a.country} · {a.phone}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => removeAddress.mutate(a.id)}
                  className="text-gray-500 underline hover:text-red-600"
                >
                  Изтрий
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">Нямаш запазени адреси.</p>
        )}
      </section>

      <section>
        <h2 className="mb-3 text-lg font-semibold">Добави адрес</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            addAddress.mutate(form);
          }}
          className="grid grid-cols-2 gap-3"
        >
          <input required placeholder="Име и фамилия" value={form.fullName} onChange={field('fullName')} className="col-span-2 rounded border border-gray-300 px-3 py-2" />
          <input required placeholder="Телефон" value={form.phone} onChange={field('phone')} className="rounded border border-gray-300 px-3 py-2" />
          <input required placeholder="Град" value={form.city} onChange={field('city')} className="rounded border border-gray-300 px-3 py-2" />
          <input required placeholder="Адрес" value={form.line1} onChange={field('line1')} className="col-span-2 rounded border border-gray-300 px-3 py-2" />
          <input required placeholder="Пощенски код" value={form.postalCode} onChange={field('postalCode')} className="rounded border border-gray-300 px-3 py-2" />
          <input required placeholder="Държава" value={form.country} onChange={field('country')} className="rounded border border-gray-300 px-3 py-2" />
          <label className="col-span-2 flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.isDefault ?? false}
              onChange={(e) => setForm((f) => ({ ...f, isDefault: e.target.checked }))}
            />
            Основен адрес
          </label>
          <div className="col-span-2">
            <Button type="submit" disabled={addAddress.isPending}>
              {addAddress.isPending ? 'Запазване…' : 'Запази адрес'}
            </Button>
          </div>
        </form>
      </section>
    </div>
  );
}
