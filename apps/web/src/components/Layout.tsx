import { Outlet, Link } from 'react-router-dom';
import LanguageSwitcher from './LanguageSwitcher';
import { useCategories } from '../features/catalog/queries';

export default function Layout() {
  const { data: categories } = useCategories();
  const topNav = (categories ?? []).slice(0, 8);

  return (
    <div className="flex min-h-screen flex-col">
      <header className="bg-brand text-white">
        <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3">
          <Link to="/" className="text-xl font-extrabold tracking-wide">
            DECATHLON
          </Link>
          <LanguageSwitcher />
        </div>
        <nav className="border-t border-white/20 bg-brand-dark">
          <ul className="mx-auto flex max-w-7xl flex-wrap gap-x-5 gap-y-1 px-4 py-2 text-sm">
            {topNav.map((c) => (
              <li key={c.id}>
                <Link to={`/c/${c.slug}`} className="hover:underline">
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      <main className="flex-1 px-4 py-6">
        <Outlet />
      </main>

      <footer className="mt-10 bg-gray-100 px-4 py-8 text-sm text-gray-600">
        <div className="mx-auto max-w-7xl">
          Decathlon Clone — portfolio project · Доставка с Speedy, Econt, BoxNow · VISA · MasterCard
        </div>
      </footer>
    </div>
  );
}
