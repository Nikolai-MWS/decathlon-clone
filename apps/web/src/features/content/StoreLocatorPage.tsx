interface Store {
  city: string;
  name: string;
  address: string;
  hours: string;
}

const STORES: Store[] = [
  { city: 'София', name: 'DECATHLON София Младост', address: 'бул. Цариградско шосе 361', hours: 'Пон–Нед 09:00–21:00' },
  { city: 'София', name: 'DECATHLON София Люлин', address: 'бул. Сливница 274', hours: 'Пон–Нед 09:00–21:00' },
  { city: 'Пловдив', name: 'DECATHLON Пловдив', address: 'бул. Кукленско шосе 19', hours: 'Пон–Нед 09:00–21:00' },
  { city: 'Варна', name: 'DECATHLON Варна', address: 'бул. Владислав Варненчик 277', hours: 'Пон–Нед 09:00–21:00' },
  { city: 'Бургас', name: 'DECATHLON Бургас', address: 'ул. Транспортна 41', hours: 'Пон–Нед 09:00–21:00' },
];

export default function StoreLocatorPage() {
  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="mb-6 text-2xl font-bold">Спортни магазини DECATHLON</h1>
      <ul className="grid gap-4 sm:grid-cols-2">
        {STORES.map((s) => (
          <li key={s.name} className="rounded-lg border border-gray-200 p-4">
            <div className="text-xs font-semibold uppercase text-gray-400">{s.city}</div>
            <div className="font-semibold">{s.name}</div>
            <div className="text-sm text-gray-600">{s.address}</div>
            <div className="mt-1 text-sm text-gray-500">{s.hours}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}
